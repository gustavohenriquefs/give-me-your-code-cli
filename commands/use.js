import chalk from 'chalk'
import { useTemplateProcess } from '../controllers/template.controller.js'

async function use() {
  try {
    await useTemplateProcess().then(() => {
      console.log(
        chalk.green.bold('Template created!')
      )
    })
  } catch (error) {
    console.log(
      chalk.red.bold('Unable to create template: ', error)
    )
  }
}

export { use }
