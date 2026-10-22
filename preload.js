// preload.js — the only path from the renderer to the main process. Just load + save, nothing else.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('travelAPI', {
  loadTrips: () => ipcRenderer.invoke('trips:load'),
  saveTrips: (trips) => ipcRenderer.invoke('trips:save', trips)
});
