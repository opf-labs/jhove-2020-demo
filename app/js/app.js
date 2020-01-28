const { shell } = require('electron')
const remote = require('electron').remote
const os = require('os')

// Set up the select file dialog from the button
document.getElementById('select-file').addEventListener('click', (event) => {
  shell.showItemInFolder(os.homedir())
})

// Set up the drag and drop target
const dropTarget = document.getElementById('drop-target')
// Drop listener
dropTarget.addEventListener('drop', (event) => {
  event.preventDefault()
  event.stopPropagation()

  for (const f of event.dataTransfer.files) {
    console.log('The file(s) you dropped: ', f)
  }
})
// Dragover listener
dropTarget.addEventListener('dragover', (event) => {
  event.preventDefault()
  event.stopPropagation()
})

// Add listener for closing window
document.getElementById('close').addEventListener('click', (event) => {
  var window = remote.getCurrentWindow()
  window.close()
})

// Add listener for closing all windows
document.getElementById('close-all').addEventListener('click', (event) => {
  remote.app.quit()
})
