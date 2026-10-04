// main.js - Electron main process.
import electron from "electron";
import path from "path";

const { app, BrowserWindow } = electron;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Travel Planner",
    backgroundColor: "#f0f4f8",
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js")
    }
  });
  win.loadFile(path.join(import.meta.dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
