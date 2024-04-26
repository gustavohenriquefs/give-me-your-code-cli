import { db } from '../db.config.js'

async function createFile(data) {
  return await db.File.create({
    name: data.name,
    content: data.content,
    templateId: data.templateId
  })
}

async function getFiles() {
  return await db.File.findAll()
}

export { createFile }