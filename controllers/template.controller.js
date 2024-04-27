import { addFile } from './file.controller.js'
import { db } from '../db.config.js'
import { or } from 'sequelize'

async function addTemplate(data) {
  const transaction = await db.sequelize.transaction()
   
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

    await transaction.commit()

    return templateCreated
  } catch (error) {
    await transaction.rollback()

    throw error
  }
}

async function getTemplates() {
  return await db.Template.findAll()
}

async function getTemplatesNames() {
  return await db.Template.findAll({
    attributes: ['name'],
    order: [['createdAt', 'ASC']]
  })
}

export { addTemplate, getTemplates, getTemplatesNames }