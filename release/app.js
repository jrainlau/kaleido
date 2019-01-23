const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const { download } = require('electron-dl')
const { versionDiff, autoUpdate } = require('./autoUpdate')

function ipcMessager (window) {
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

  ipcMain.on('check-update', async (event) => {
    event.returnValue = await versionDiff()
  })

  ipcMain.on('update-version', async (event) => {
    const updateResult = await autoUpdate(window)
    event.sender.send('update-result', updateResult)
  })

  ipcMain.on('relaunch', () => {
    app.relaunch()
    app.exit(0)
  })
}

async function createWindow () {
  Menu.setApplicationMenu(null)

  const window = new BrowserWindow({
    width: 1152,
    height: 720,
    webPreferences: process.env.NODE_ENV === 'DEV' ? {} : {
      devTools: false
    }
  })

  ipcMessager(window)

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
