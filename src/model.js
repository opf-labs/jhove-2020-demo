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
// Export the File class
module.exports = {
  File: File
}
