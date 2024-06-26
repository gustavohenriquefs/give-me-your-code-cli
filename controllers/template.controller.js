import { addFile } from './file.controller.js'
import { db } from '../db.config.js'

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

async function getTemplateByName(name) {
  const templateData = await db.Template.findOne({
    where: {
      name: name
    },
    include: [{
      model: db.File,
      as: 'files'
    }]
  })

  if(!templateData) {
    throw new Error('Template not found')
  }

  return templateData
}

async function getTemplatesNames() {
  return await db.Template.findAll({
    attributes: ['name'],
    order: [['createdAt', 'ASC']]
  })
}

export { addTemplate, getTemplates, getTemplatesNames, getTemplateByName }