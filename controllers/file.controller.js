import { db } from '../db.config.js'

async function addFile(data) {
  return await db.File.create({
    name: data.name,
    content: data.content,
    templateId: data.templateId
  })
}

async function getFiles() {
  return await db.File.findAll()
}

export { addFile }