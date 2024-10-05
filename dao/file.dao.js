import { db } from '../db.config.js'

async function addFile(data, transaction) {
  return await db.File.create({
    name: data.name,
    content: data.content,
    templateId: data.templateId
  }, { transaction })
}

async function getFiles() {
  return await db.File.findAll()
}

async function getFileByTemplateId(templateId) {
  return await db.File.findAll({
    attributes: ['name', 'content', 'id'],
    where: {
      templateId
    }
  })
}

export { addFile, getFiles, getFileByTemplateId }