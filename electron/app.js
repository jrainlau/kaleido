const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain
const download = require('download')

ipcMain.on('start-download', (event, { wallpapers, dirPath }) => {
  console.log(wallpapers, dirPath)
  Promise
    .all(wallpapers.map(x => download(x, dirPath)))
    .then(() => {
      event.returnValue = 'Download completed!'
    })
})

let url
if (process.env.NODE_ENV === 'DEV') {
  url = 'http://localhost:8080/'
} else {
  url = `file://${process.cwd()}/dist/index.html`
}

app.on('ready', () => {
  let window = new BrowserWindow({ width: 1200, height: 800 })
  window.webContents.openDevTools()
  window.loadURL(url)
})
