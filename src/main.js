// Modules to control application life and create native browser window
const { BrowserWindow, Menu, app, shell } = require('electron')
const { ipcMain } = require('electron')
const url = require('url')
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))

if (process.mas) app.name = 'JHOVE 2020 Technical Review'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
const toProcess = []
const jobWindows = []

const template = [{
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(win => {
            if (win.id > 1) win.close()
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: 'Reopen Window',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: () => {
      app.emit('activate')
    }
  }]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'About OPF',
    click: () => {
      shell.openExternal('https://openpreservation.org')
    }
  }]
}]

function createWindow () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    title: app.name,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Opens web tools for debugging, uncomment if trouble with main window
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Handler for the select-file event from the main page button
ipcMain.on('select-file', (event, path) => {
  const os = require('os')
  const { dialog } = require('electron')
  // Options for the file selector
  const fileSelectOpts = {
    title: 'Queue files for processing',
    defaultPath: os.homedir(),
    buttonLabel: 'Queue',
    properties: ['openFile', 'multiSelections']
  }
  // Pop open the file selection dialog with result handler
  dialog.showOpenDialog(mainWindow, fileSelectOpts).then((result) => {
    // If the dialog was cancelled then we can get out of dodge
    if (!result.cancelled) {
      // Not cancelled, cycle through the file path string results
      for (const filePath of result.filePaths) {
        // Create a mode.File instance and push onto the processing queue
        const file = model.File.fromPath(filePath)
        toProcess.push(file)
      }
    }
  }).catch(err => {
    console.log(err)
  })
})

// Handler for drop-file event, this is a secondary handler and gets a list
// of model.File instances
ipcMain.on('drop-file', (event, files) => {
  // Simply iterate the files and push them onto the queue (could probably be a splice)
  for (const file of files) {
    toProcess.push(file)
  }
})

// Handler for the process event, take the setup and apply it to the files in the
// processing queue
ipcMain.on('process', (event, profileKey) => {
  // Iterated the the queue of model.File instances
  for (const file of toProcess) {
    // Each result get's it's own window for now
    const child = new BrowserWindow({
      parent: mainWindow,
      modal: false,
      show: false,
      title: file.name,
      webPreferences: {
        nodeIntegration: true
      }
    })
    // No menu for the children yet
    child.setMenu(null)
    child.loadURL(url.format({
      pathname: path.join(__dirname, '..', 'app/console.html'),
      protocol: 'file:',
      slashes: true
    }))
    // Opens web tools for debugging, uncomment if trouble with console windows
    // child.webContents.openDevTools()
    child.once('ready-to-show', () => {
      child.show()
      // Push the child onto the job stack
      jobWindows.push(child)
      // Run the file utility for now
      console.log(profileKey)
      var tool = model.Tools[profileKey]
      tool.execute(Object.keys(tool.profiles)[0], file.path, child)
    })
  }
  // Clear the processing queue
  toProcess.length = 0
})
