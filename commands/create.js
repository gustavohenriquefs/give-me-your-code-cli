import { getTemplatesNames, getTemplateByName } from '../controllers/template.controller.js'
import inquirer from 'inquirer'
import fs from 'fs'
import chalk from 'chalk'
import path from 'path'

async function selectTemplate() {
  const templates = await getTemplatesNames()
  
  if(!templates.length) {
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

function createFolder(folderName) {
  if (!fs.existsSync(folderName)){
    fs.mkdirSync(folderName)
  }
}

function createFiles(files, folderName) {
  files.forEach(file => {
    const filePath = path.join(folderName, file.name)

    fs.writeFileSync(filePath, file.content)
  })
}

function create() {
  try {
    selectTemplate().then((templateSelected) => {
      if(!templateSelected) {
        return
      }

      getTemplateByName(templateSelected).then((templateData) => {

        createFolder(templateData.name)
        createFiles(templateData.files, templateData.name)

        console.log(
          chalk.green.bold('Template created successfully!')
        )

      })
    })
    
  } catch (error) {
    console.log(
      chalk.red.bold('Unable to create template: ', error)
    )
  }
}

export { create }