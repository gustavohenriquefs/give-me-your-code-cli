import { conf } from './index.js';
import chalk from 'chalk';
import { getTemplatesNames } from '../controllers/template.controller.js';
import inquirer from 'inquirer';

const templateListKey = 'templates'

async function setTemplateList() {
  await getTemplatesNames().then(templates => 
    conf.set(templateListKey, templates)
  )
}

function list() {
  setTemplateList().then(() => {
    const templateListConf = conf.get('templates')

    if(templateListConf && templateListConf.length) {
      templateListConf.forEach((task, index) => {
        
        console.log(
          chalk.blue( 
          `${index + 1}. ${task.name}`
          )
        )
        
      })
    }
  })
}

function use() {
  const templateListConf = conf.get('templates')
  
  if(templateListConf && templateListConf.length) {
    const choices = templateListConf.map((task, index) => ({
      name: `${index + 1}. ${task.name}`,
      value: index
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Choose a template:',
        choices: choices
      }
    ]).then(answers => {
      console.log(`You selected: ${templateListConf[answers.selected].name}`);
    });
  } else {
    console.log(chalk.red('No items found.'))
  }
}

export { list }