# claude-token-economy — Claude için Ödül/Ceza (Token Economy) Sistemi

## Context

Viral olan **BadClaude/OpenWhip** (Claude'a kırbaç şaklatıp "Work FASTER" mesajı gönderen Electron uygulaması) ve onun pozitif forku **GoodClaude**'dan (sihirli değnek + "you're doing amazing sweetie") ilhamla, ikisini birleştiren tek bir sistem kuruyoruz. Okullarda kullanılan davranış yönetimi tabiri olan **"token economy"** (jeton ekonomisi) adıyla: her başarılı görevden sonra ödül (+1 token), her başarısız/beğenilmeyen işten sonra ceza (-1 token). Kullanıcı kararları:

- Klasör: `/Users/canerpinarbasi/claude-token-economy`
- Format: **CLI + Claude Code hooks çekirdeği ÜSTÜNE Electron overlay** (ikisi birden)
- Ödül/ceza **gerçekten etkili**: hook'lar güncel bakiye + son geri bildirimleri Claude'un context'ine enjekte eder.

Ortam doğrulandı: Node v25.6.1 + npm 11.9.0 kurulu, hedef klasör boş, `afplay`/`osascript` mevcut. **Kritik:** `~/.claude/settings.json` içinde halihazırda `hooks.Notification`, `allowedTools` ve `model` var — hook kurulumu **deep-merge** yapmalı, asla üzerine yazmamalı (önce yedek alınacak).

## Teknik Kararlar

- **Node.js (ESM), TypeScript yok.** Electron katmanı zaten Node; ledger/grades/context modülleri hem CLI hem Electron main process tarafından doğrudan import edilir.
- **Bağımlılık:** çekirdekte sıfıra yakın (elle argv parse, `crypto.randomUUID()`). Electron tek ağır bağımlılık, kendi workspace'inde izole.
- **npm workspaces:** `packages/core` (CLI + hooks) ve `packages/overlay` (Electron).
- Çalışma verisi repo DIŞINDA: `~/.claude-token-economy/{ledger.json, config.json, state.json}` (hook'lar her projeden tetiklenir, bakiye globaldir; her kayıt `cwd` tuttuğu için proje bazlı dilimleme mümkün).

## Dizin Yapısı

```
claude-token-economy/
├── package.json                  # workspaces, private
├── README.md
├── scripts/install-hooks.js      # ~/.claude/settings.json'a deep-merge (yedekli)
└── packages/
    ├── core/
    │   ├── package.json          # bin: { "cte": "bin/cte.js" }
    │   ├── bin/cte.js            # reward|punish|status|report|hook|install-hooks router
    │   └── src/
    │       ├── paths.js          # ~/.claude-token-economy/* yol çözümü
    │       ├── ledger.js         # load/append/balance; atomik yazma (tmp+rename); self-heal
    │       ├── grades.js         # bakiye -> not/seviye, streak tespiti
    │       ├── context.js        # additionalContext metni (iki hook da paylaşır)
    │       ├── report.js         # markdown karne üreticisi
    │       ├── sound.js          # afplay/say, fire-and-forget
    │       └── hooks.js          # stdin JSON -> hookSpecificOutput JSON
    └── overlay/
        ├── package.json          # deps: electron; @cte/core'a bağımlı
        ├── main.js               # tray, şeffaf click-through pencere, globalShortcut, IPC
        ├── preload.js            # contextBridge
        ├── lib/automation.js     # osascript System Events keystroke (+ opsiyonel Ctrl-C)
        ├── lib/messages.js       # övgü/azar mesaj havuzları
        ├── renderer/             # index.html + overlay.js + wand.js + whip.js (canvas)
        └── assets/               # tray ikonları, sesler (sistem sesleri fallback)
```

## Ledger Şeması (`~/.claude-token-economy/ledger.json`)

```json
{
  "version": 1,
  "balance": -2,
  "entries": [{
    "id": "uuid", "ts": "ISO", "type": "reward|punish", "delta": 1,
    "reason": "no tests written", "sessionId": "abc|null",
    "cwd": "/path", "source": "cli|overlay-wand|overlay-whip"
  }]
}
```
- `balance` cache'tir; yüklemede entries'ten yeniden hesaplanır, uyuşmazlıkta self-heal.
- Atomik yazma: `.tmp` + `fs.renameSync`. Bozuk dosya → yedekle, sıfırdan başla, stderr'e uyar.
- `state.json`: `lastInjectedEntryId` (enjeksiyon gürültü kontrolü) + `lastStopSessionId` (son biten görevin atıfı).
- `config.json`: `sounds`, `injectEveryPrompt`, `contextEntries`, `typeIntoTerminal`, `thresholds`.

## CLI (`cte`)

| Komut | Davranış |
|---|---|
| `cte reward [sebep...]` | ödül kaydı + `Glass.aiff`, yeni bakiye + not yazdır |
| `cte punish [sebep...]` | ceza kaydı + `Basso.aiff`; Detention eşiğinde `say` uyarısı |
| `cte status` | tek satır: bakiye, not, streak, son kayıt; `--json` bayrağı |
| `cte report` | markdown karne; `--out file.md` |
| `cte hook <event>` | dahili hook adaptörü (stdin JSON → stdout JSON) |
| `cte install-hooks` | settings.json merge kurulumu |

Sebep tırnaksız rest-args. Sesler `spawn(..., {detached:true}).unref()` ile anında çıkış.

## Claude Code Hooks Entegrasyonu

Kurulum `~/.claude/settings.json`'a (mevcut `Notification` hook'u KORUYARAK, timestamped yedek aldıktan sonra) mutlak yollarla merge eder — node yolu `process.execPath` ile keşfedilir (non-interactive shell'de PATH'e güvenilmez):

- **SessionStart** → tam özet enjekte: bakiye, not, streak, son 5 kayıt (sebep + göreli zaman) + 1 davranış telkini satırı. Çıktı: `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}`
- **UserPromptSubmit** → aynı format ama **sadece ledger son enjeksiyondan beri değiştiyse** (en yeni entry id ≠ `state.json.lastInjectedEntryId`); değişmediyse hiçbir şey basma, exit 0. Böylece her prompt'ta spam olmaz ama oturum ortasındaki kırbaç şaklaması bir sonraki mesajda Claude'a ulaşır.
- **Stop** → `session_id`'yi `state.json.lastStopSessionId`'ye yazar (sonraki reward/punish biten göreve atfedilir); opsiyonel yumuşak Tink sesi.
- Tüm hook'lar her zaman exit 0; hata stderr'e — bozuk ledger Claude'u asla bloklamamalı.

**Enjekte edilen context** (~450 karakter tavan, sebepler 60 karaktere kırpılır):
```
[Token Economy] Balance: -2 — Grade: DETENTION. Recent feedback:
✗ "didn't write tests" (2h ago) | ✗ "ignored lint errors" (1d) | ✓ "great refactor" (1d)
You have been punished in 3 of the last 5 tasks; repeated reason: tests. Adjust behavior accordingly.
```
"Tekrarlayan sebep" satırı: son 10 negatif sebep üzerinde basit kelime frekansı (stopword'ler atılır, sayısı ≥2 olan en sık token).

## Electron Overlay

- **Tray:** canlı bakiye/not, Wand/Whip mod geçişi, "Overlay enabled" ve "Type messages into terminal" (varsayılan KAPALI) onay kutuları, Quit.
- **Pencere:** ekran boyutu, `transparent, frame:false, alwaysOnTop:"screen-saver"`, `setVisibleOnAllWorkspaces(true, {visibleOnFullScreenSpaces:true})`, ve kritik: `setIgnoreMouseEvents(true, {forward:true})` — tamamen tıklama geçirgen ama mousemove renderer'a ulaşır (değnek/kırbaç imleci takip eder).
- **Tetikleyiciler:** click-through pencerede tıklama yakalanamaz → `globalShortcut`: `Cmd+Shift+G` (ödül: yıldız patlaması + çan) ve `Cmd+Shift+B` (ceza: kırbaç şaklaması + kırmızı kenar flaşı + crack sesi).
- **Animasyon (canvas, rAF):** wand.js — imlece lerp'le yaklaşan değnek + pasif parıltı + tetikte 80–120 yerçekimli yıldız partikülü; whip.js — 12–15 segmentli verlet halat, tetikte zincire impuls.
- **Tetikte (main process):** (1) `@cte/core` `ledger.append(...)` doğrudan çağrılır — CLI ile aynı atomik yazıcı, sonraki UserPromptSubmit otomatik enjeksiyonu tetikler; (2) "type into terminal" açıksa `osascript 'System Events' keystroke` ile rastgele mesaj yazılır ("you're doing amazing sweetie" / "Work FASTER. That's -1 token."), whip modunda opsiyonel önce Ctrl-C (OpenWhip tarzı interrupt).
- **İzin notu (README + tray'de):** keystroke için Accessibility izni gerekir; tuşlar EN ÖNDEKİ uygulamaya gider — bu yüzden varsayılan kapalı.

## Gamification (`grades.js`, `report.js`)

| Bakiye | Not |
|---|---|
| ≥ 20 | Valedictorian |
| ≥ 10 | Honor Roll |
| ≥ 5 | Gold Star Student |
| ≥ 0 | Good Standing |
| -1 … -4 | Needs Improvement |
| ≤ -5 | Detention |
| ≤ -10 | Suspended (enjeksiyon en sert üsluba geçer) |

Ek: 5'lik ödül serisi = "perfect attendance" satırı; "GPA" = son 20 kaydın ortalama deltası → 0.0–4.0. `cte report`: not + GPA + bakiye sparkline (▁▂▄▆█) + geçmiş tablosu + sebep frekanslarından sentezlenen "Teacher's Comments".

## Yapım Sırası ve Doğrulama

**Faz 1 — ledger + CLI**: scaffold, `packages/core`, kök `npm install`.
Doğrulama: `cte reward "wrote great tests"` → Glass sesi + ledger oluştu, bakiye 1; 6× `cte punish` → status Detention gösterir; ledger'ı elle boz → `cte status` yedekleyip kurtarır; `cte report` düzgün markdown üretir.

**Faz 2 — hooks**: `hooks.js`, `context.js`, `cte hook`, `install-hooks.js`.
Doğrulama: (1) offline — `echo '{"session_id":"t1",...}' | cte hook user-prompt-submit` → geçerli JSON, ikinci çalıştırmada (ledger değişmediği için) boş çıktı; (2) `cte install-hooks` → settings.json yedekle diff'lenir, Notification hook'u sağlam; (3) canlı — yeni `claude` oturumunda "token economy context'in ne diyor?" diye sor → bakiye/not/sebepleri aktarmalı; başka terminalden `cte punish "too verbose"` → sonraki prompt'ta güncel bakiye görünmeli.

**Faz 3 — Electron overlay**: `packages/overlay`, kökte `npm run overlay`.
Doğrulama: tray canlı bakiye gösterir; overlay açıkken alttaki uygulamalara tıklanabilir/yazılabilir; `Cmd+Shift+G` → patlama + çan + `cte status`'ta yeni kayıt; "type into terminal" + Accessibility izni → önce TextEdit'te test, sonra tam döngü: Claude oturumu açık → kırbaç → mesaj terminale düşer → sonraki prompt'un context'inde yeni ceza görünür.

## Riskler / Notlar

- Hook komutlarında mutlak node + script yolları şart (non-interactive shell PATH).
- CLI/overlay eşzamanlı yazmaları atomik rename ile yeterince güvenli (±1 ledger'da last-write-wins kabul edilebilir).
- Enjeksiyon ~450 karakter altında tutulur, context'i şişirmez.
- Electron `transparent`+`alwaysOnTop` Spaces arası farklı davranır; fullscreen terminaller için `visibleOnFullScreenSpaces` gerekli.

## Kritik Dosyalar

- `packages/core/src/ledger.js` — her şeyin çağırdığı atomik ledger temeli
- `packages/core/bin/cte.js` — CLI router
- `packages/core/src/hooks.js` + `context.js` — hook adaptörleri ve enjeksiyon metni
- `scripts/install-hooks.js` — mevcut Notification hook'unu koruyan deep-merge kurucu
- `packages/overlay/main.js` — tray, click-through pencere, kısayollar, osascript otomasyonu
