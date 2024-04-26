import { db } from '../db.config.js'
import { createFile } from './file.controller.js'

async function createTemplate(data) {
  try {
    const files = []
    let templateCreated = {}

    templateCreated = await db.Template.create({
      name: data.name,
      description: data.description
    })

    await Promise.all(data.files.map(async file => {
      file.templateId = templateCreated.id

      const fileCreated = await createFile(file)
      
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

export { createTemplate, getTemplates }