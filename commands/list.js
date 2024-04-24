import Conf from 'conf';
import chalk from 'chalk';
import { templateList } from '../db/templates.js';

const conf = new Conf({ projectName: 'give-me-your-code-cli' });

const templateListKey = 'templates'

function initTemplateList() {
  conf.set(templateListKey, templateList);
}

initTemplateList()

import inquirer from 'inquirer';

function list() {
  const templateListConf = conf.get('templates')

  if(templateListConf && templateListConf.length) {
    templateListConf.forEach((task, index) => {
      console.log(`${index + 1}. ${task.name}`);
    });
  }
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