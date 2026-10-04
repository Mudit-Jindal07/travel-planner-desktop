const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('travelAPI', {
  loadTrips: () => ipcRenderer.invoke('trips:load'),
  saveTrips: (trips) => ipcRenderer.invoke('trips:save', trips)
});
