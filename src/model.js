// A few basic model types exported as a module, could be PAR compliant
var fs = require('fs')
var path = require('path')

// Class to handle file details
class File {
  constructor (name, path, size, lastModified, lastModifiedDate) {
    this.name = name
    this.path = path
    this.size = size
    this.lastModified = lastModified
    this.lastModifiedDate = lastModifiedDate
  }

  // Factory method that creates a new instance from a Dialog dataTransfer
  static fromDataTransferFile (dtFile) {
    return new File(dtFile.name, dtFile.path, dtFile.size,
      dtFile.lastModified, dtFile.lastModifiedDate)
  }

  // Factory method to create a File instance from a String path alone
  static fromPath (filePath) {
    const stats = fs.statSync(filePath)
    const fileObj = new File(path.parse(filePath).base, filePath,
      stats.size, stats.mtimeMs, stats.mtime)
    return fileObj
  }
}
class Tool {
  constructor (name, command, profiles) {
    this.name = name
    this.command = command
    this.profiles = profiles
  }

  execute (profileName, path, consoleWin) {
    const { spawn } = require('child_process')
    // Get the profile arg array and tag on the path
    const profArgs = this.profiles[profileName]
    const jobArgs = profArgs.concat([path])
    const proc = spawn(this.command, jobArgs)

    // Handle standard out, raise a message
    proc.stdout.on('data', (data) => {
      consoleWin.webContents.send('process-out', data)
    })

    // Raise another message for standard error
    proc.stderr.on('data', (data) => {
      consoleWin.webContents.send('process-err', data)
    })

    // Finally a message for the return status
    proc.on('close', (code) => {
      consoleWin.webContents.send('process-exit', code)
    })
  }
}
var tools = {
  file: new Tool('File', 'file', { MIME: ['-i'], version: ['--version'] }),
  FIDO: new Tool('FIDO', 'fido', { PUID: [], version: ['-v'] }),
  Jpylyzer: new Tool('Jpylyzer', 'jpylyzer', { RUN: [], version: ['--version'] }),
  JHOVE: new Tool('JHOVE', 'jhove', { version: ['--version'] })
}
module.exports = {
  File: File,
  Tool: Tool,
  Tools: tools
}
