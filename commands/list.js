import { conf } from './index.js';
import chalk from 'chalk';
import { getTemplatesNames } from '../dao/template.dao.js';

const templateListKey = 'templates'

async function setTemplateList() {
  await getTemplatesNames().then(templates => {
    conf.set(templateListKey, templates)
    
    if(!templates.length) {
      console.log(chalk.red('No items found.'));
    }
  })
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

export { list }