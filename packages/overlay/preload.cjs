const { contextBridge, ipcRenderer } = require("electron");

// Bridge main-process events to the renderer's canvas overlay.
contextBridge.exposeInMainWorld("cte", {
  onMode: (cb) => ipcRenderer.on("mode", (_e, mode) => cb(mode)),
  onEnabled: (cb) => ipcRenderer.on("enabled", (_e, on) => cb(on)),
  onTrigger: (cb) => ipcRenderer.on("trigger", (_e, kind) => cb(kind)),
  animationDone: () => ipcRenderer.send("animation-done"),
});
