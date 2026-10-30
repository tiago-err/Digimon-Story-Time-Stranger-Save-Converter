const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectZip: () => ipcRenderer.invoke('select-zip'),
  scanFolder: (folder) => ipcRenderer.invoke('scan-folder', folder),
  openFolder: (folder) => ipcRenderer.invoke('open-folder', folder),
  convert: (args) => ipcRenderer.invoke('convert', args)
});
