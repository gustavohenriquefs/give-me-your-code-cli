import { addFile } from './file.controller.js'
import { db } from '../db.config.js'

async function addTemplate(data) {
  try {
    const files = []
    let templateCreated = {}

    templateCreated = await db.Template.create({
      name: data.name,
      description: data.description
    })

    await Promise.all(data.files.map(async file => {
      file.templateId = templateCreated.id

      const fileCreated = await addFile(file)
      
      files.push(fileCreated)
    }));

    templateCreated.files = files

    return templateCreated
  } catch (error) {
    throw error
  }
}

async function getTemplates() {
  return await db.Template.findAll()
}

async function getTemplatesNames() {
  return await db.Template.findAll({
    attributes: ['name']
  })
}

export { addTemplate, getTemplates, getTemplatesNames }