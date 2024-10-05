import { conf } from './index.js';
import chalk from 'chalk';
import { getTemplatesNames } from '../dao/template.dao.js';
import inquirer from 'inquirer';
import { getFileByTemplateId } from '../dao/file.dao.js';

const templateListKey = 'templates'
const fileListKey = 'files'

async function setTemplateList() {
  await getTemplatesNames().then(templates => {
    conf.set(templateListKey, templates)

    if (!templates.length) {
      console.log(chalk.red('No items found.'));
    }
  })
}

function list() {
  setTemplateList().then(() => {
    const templateListConf = conf.get('templates')

    if (templateListConf?.length) {
      templateListConf.forEach((task, index) => {
        console.log(
          chalk.blue(
            `${task.id}. ${task.name}`
          )
        )

      })
    }
  })
}

async function setFileList(templateId) {
  await getFileByTemplateId(templateId).then(files => {
    conf.set(fileListKey, files)

    if (!files.length) {
      console.log(chalk.red('No items found.'));
    }
  });
}

async function listFiles(templateId) {
  await setFileList(templateId);

  const fileListConf = conf.get(fileListKey);

  fileListConf.push({ id: -1, name: 'Voltar' })

  const id = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Choose a file:',
      choices: fileListConf.map((file) => file.name),
      filter: function (val) {
        return fileListConf.find((file) => file.name === val).id
      }
    }
  ]);

  return id.selected;
}

async function listFilesAndViewContent(templateId) {
  const fileId = await listFiles(templateId);

  if (fileId === -1) {
    return listAll();
  }

  const content = conf.get(fileListKey).find((file) => file.id === fileId)?.content ?? '';

  console.log(
    chalk.blue(
      content
    )
  );

  return listFilesAndViewContent(templateId);
}

async function listAll() {
  await setTemplateList();

  const templateListConf = conf.get('templates')

  templateListConf.push({ id: -1, name: 'Sair' })

  if (templateListConf?.length) {
    const id = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Choose a template:',
        choices: templateListConf.map((template) => template.name),
        filter: function (val) {
          return templateListConf.find((template) => template.name === val)?.id
        }
      }
    ])

    if (id.selected === -1) {
      return
    }

    return listFilesAndViewContent(id.selected);
  }
}

export { list, listAll }