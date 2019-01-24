const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const { download } = require('electron-dl')
const { versionDiff, autoUpdate } = require('./autoUpdate')
const { resolve } = require('path')

let window = null

async function downloader (url, dirPath) {
  const result = await download(BrowserWindow.getFocusedWindow(), url, {
    directory: dirPath
  })
  return result
}

function ipcMessager (window) {
  ipcMain.on('start-download', async (event, { wallpapers, dirPath }) => {
    console.log(wallpapers, dirPath)
    while (wallpapers.length) {
      const url = wallpapers.shift()
      await downloader(url, dirPath)
    }
    event.returnValue = 'Download completed!'
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

const menus = Menu.buildFromTemplate([
  {
    label: 'Kaleido',
    submenu: [{
      label: 'About',
      click () {
        shell.openExternal('https://github.com/jrainlau/kaleido')
      }
    }, {
      type: 'separator'
    }, {
      label: 'Source',
      click () {
        shell.openExternal('http://wallpaperswide.com/')
      }
    }, {
      label: 'Privacy policy',
      click () {
        shell.openExternal('http://wallpaperswide.com/policy.html')
      }
    }, {
      type: 'separator'
    }, {
      role: 'toggledevtools'
    }, {
      type: 'separator'
    }, {
      role: 'reload'
    }, {
      role: 'quit'
    }]
  }
])

async function createWindow () {
  Menu.setApplicationMenu(menus)

  window = new BrowserWindow({
    width: 1152,
    height: 720
  })

  ipcMessager(window)

  window.setResizable(false)
  if (process.env.NODE_ENV === 'DEV') {
    window.loadURL('http://localhost:8080/')
    window.webContents.openDevTools()
  } else {
    window.loadFile(resolve(__dirname, './index.html'))
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  app.quit()
})
