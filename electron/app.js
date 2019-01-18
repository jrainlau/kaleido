const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const download = require('download')

ipcMain.on('start-download', (event, { wallpapers, dirPath }) => {
  console.log(wallpapers, dirPath)
  Promise
    .all(wallpapers.map(x => download(x, dirPath)))
    .then(() => {
      event.returnValue = 'Download completed!'
    })
})

function createWindow () {
  Menu.setApplicationMenu(null)

  const window = new BrowserWindow({
    width: 1152,
    height: 720,
    webPreferences: process.env.NODE_ENV === 'DEV' ? {} : {
      devTools: false
    }
  })

  window.setResizable(false)
  if (process.env.NODE_ENV === 'DEV') {
    window.loadURL('http://localhost:8080/')
    window.webContents.openDevTools()
  } else {
    window.loadFile('index.html')
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  app.quit()
})
