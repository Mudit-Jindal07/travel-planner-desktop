// main.js - Electron main process.
import electron from "electron";
import path from "path";
import fs from "fs";

const { app, BrowserWindow, ipcMain } = electron;

function getTripsFilePath() {
  return path.join(app.getPath("userData"), "trips.json");
}

function readTripsFromDisk() {
  try {
    const filePath = getTripsFilePath();
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) || [];
  } catch (err) {
    console.error("Failed to read trips.json:", err);
    return [];
  }
}

function writeTripsToDisk(trips) {
  try {
    fs.writeFileSync(getTripsFilePath(), JSON.stringify(trips, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write trips.json:", err);
    return false;
  }
}

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

ipcMain.handle("trips:load", () => readTripsFromDisk());
ipcMain.handle("trips:save", (_event, trips) => writeTripsToDisk(trips));

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
