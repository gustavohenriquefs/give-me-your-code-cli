import { addFile } from './file.dao.js'
import { db } from '../db.config.js'

async function addTemplate(data) {
  const transaction = await db.sequelize.transaction()

  try {
    const files = []
    let templateCreated = {}

    templateCreated = await db.Template.create({
      name: data.name,
      description: data.description
    }, { transaction })

    await Promise.all(data.files.map(async file => {
      file.templateId = templateCreated.id

      const fileCreated = await addFile(file, transaction)

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

  if (!templateData) {
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

async function updateTemplate(data) {
  console.log('Dados recebidos:', data)
  const transaction = await db.sequelize.transaction()

  try {
    const template = await db.Template.findOne({
      where: { name: data.name }
    }, { transaction })

    if (data.name) template.name = data.name
    if (data.description) template.description = data.description
    if (data.files) {
      await Promise.all(data.files.map(async file => {
        if (file.id) {
          const fileToUpdate = template.files.find(f => f.id === file.id)

          if (fileToUpdate) {
            fileToUpdate.name = file.name
            fileToUpdate.content = file.content

            await fileToUpdate.save({ transaction })
          }
        } else {
          file.templateId = template.id

          await addFile(file, transaction)
        }
      }))
    } else {
      template.files = []
    }

    await template.save({ transaction })

    await transaction.commit()

    return template
  } catch (error) {
    await transaction.rollback()

    throw error
  }
}

export {
  addTemplate,
  getTemplates,
  getTemplatesNames,
  getTemplateByName,
  updateTemplate
}