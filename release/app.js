const https = require('https')
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const { download } = require('electron-dl')

const currentVersion = require('./package.json').version
console.log(currentVersion)

ipcMain.on('start-download', (event, { wallpapers, dirPath }) => {
  console.log(wallpapers, dirPath)
  Promise
    .all(wallpapers.map(x => download(BrowserWindow.getFocusedWindow(), x, {
      saveAs: false,
      directory: dirPath,
      openFolderWhenDone: true
    })))
    .then(() => {
      event.returnValue = 'Download completed!'
    })
})

function createWindow () {
  Menu.setApplicationMenu(null)

  const window = new BrowserWindow({
    width: 1152,
    height: 720
    // webPreferences: process.env.NODE_ENV === 'DEV' ? {} : {
    //   devTools: false
    // }
  })

  setInterval(() => {
    window.webContents.send('console', process.env.NODE_ENV)
  }, 1000)

  window.setResizable(false)
  if (process.env.NODE_ENV === 'DEV') {
    window.loadURL('http://localhost:8080/')
    window.webContents.openDevTools()
  } else {
    window.loadFile('index.html')
    window.webContents.openDevTools()
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  app.quit()
})
