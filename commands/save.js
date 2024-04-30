import { addTemplate } from '../controllers/template.controller.js'
import fs from 'fs'

function getCurrentDirectoryBase() {
  return process.cwd()
}

function getFileContentFromPath(path) {
  return fs.readFileSync(path, 'utf8')
}

function getFilesNameOnDirectory(path) {
  return fs.readdirSync(path);
}

function save(options) {
  const data = {
    name: options.template ?? '',
    description: options.description ?? '',
    files: []
  }

  const currentPath = getCurrentDirectoryBase()

  getFilesNameOnDirectory(currentPath).forEach((file, idx) => {
    if (file === options.file) {
      const content = getFileContentFromPath(`${currentPath}/${file}`)

      data.files.push({ content, file })
    }
  })

  addTemplate(data)
    .then(() => console.log('Template saved successfully'))
    .catch(error => console.error(error))
} 

export { save } 