import inquirer from 'inquirer'
import chalk from 'chalk'

import { getTemplatesNames, getTemplateByName } from '../dao/template.dao.js'
import { createFolder, createFiles } from '../controllers/file.controller.js'

export async function selectTemplate() {
  const templates = await getTemplatesNames()

  if (!templates.length) {
    console.log(
      chalk.red('No items found.')
    )

    return Promise.resolve(null)
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Choose a template:',
      choices: templates
    }
  ])

  return answer.selected
}


export async function useTemplateProcess() {
  const templateSelected = await selectTemplate()

  if (!templateSelected) {
    throw new Error('No template selected')
  }

  const templateData = await getTemplateByName(templateSelected)

  if (!templateData) {
    throw new Error('Template not found')
  }

  createFolder(templateData.name)
  createFiles(templateData.files, templateData.name)
}


export async function openTemplateInVim() {
  const templateSelected = await selectTemplate()

  if (!templateSelected) {
    throw new Error('No template selected')
  }

  const templateData = await getTemplateByName(templateSelected)

  if (!templateData) {
    throw new Error('Template not found')
  }

  addTemplateUsingVim()
}
