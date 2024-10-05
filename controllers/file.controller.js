import fs from 'fs'
import path from 'path'

export function createFolder(folderName) {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
}

export function createFiles(files, folderName) {
  files.forEach(file => {
    const filePath = path.join(folderName, file.name)

    fs.writeFileSync(filePath, file.content)
  })
}