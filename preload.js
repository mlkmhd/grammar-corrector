const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onClipboardUpdateText: (callback) => ipcRenderer.on('update-clipboard-text', (_event, value) => callback(value)),
  onUpdateText: (callback) => ipcRenderer.on('update-text', (_event, value) => callback(value)),
  onProgressUpdate: (callback) => ipcRenderer.on('update-progress', (_event, value) => callback(value))
});
