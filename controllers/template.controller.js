import { db } from '../db.config.js'
import { createFile } from './file.controller.js'

async function createTemplate(data) {
  try {
    const files = []

    const templateCreated = await db.Template.create({
      name: data.name,
      description: data.description
    })
    console.log("Values", templateCreated.dataValues.id)

    for(const file of data.files) {
      const fileCreated = await createFile({
        name: file.name,
        content: file.content,
        templateId: templateCreated.dataValues.id
      })

      files.push(fileCreated)
    }

    templateCreated.file = files

    return template
  } catch (error) {
    throw error
  }
}

async function getTemplates() {
  return await db.Template.findAll()
}

export { createTemplate, getTemplates }