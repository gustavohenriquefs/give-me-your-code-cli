import Conf from 'conf';
import chalk from 'chalk';
import { templateList } from '../db/templates.js';
import { exec } from 'child_process';
import fs from 'fs/promises';

const conf = new Conf({ projectName: 'give-me-your-code-cli' });
const rootPath = './temp';
const filePath = `${rootPath}/new-template-file.cpp`;

const templateListKey = 'templates'

function initTemplateList() {
  conf.set(templateListKey, templateList);
}

initTemplateList()

import inquirer from 'inquirer';

function create() {
  selectCodeEditor();
}


function getEditors() {
  return [
    {
      editor: 'vim',
      command: 'vim',
      needSaveCommand: false
    },
    {
      editor: 'vscode',
      command: 'code',
      needSaveCommand: true
    }
  ]
}

function getFolderOfNewTemplate(templateName) {
  // pegar dados dos folter em path ./temp
}

function openSelectedEditor(editorName) {
  const editors = getEditors()
  const editorData = editors
    .find(editorData => editorData.editor === editorName)

  if(!editorData) {
    console.log(chalk.red('Editor not found'))
    return
  }

  const command = `${editorData.command} ${filePath}`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red(`error: ${error.message}`))
      return;
    }

    if (stderr) {
      console.log(chalk.red(`stderr: ${stderr}`))
      return;
    }
    
    console.log(`stdout: ${stdout}`)
  })

  if(editorData.needSaveCommand) {
    console.log(
      chalk.yellow.bold(
        'After saving the file, run the command: gmyc save-template <template-name>'
      )
    )
  }
}

function selectCodeEditor() {
  const editors = getEditors();

  const editorsName = editors.map(editorData => editorData.editor)

  inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Choose a template:',
      choices: editorsName
    }
  ]).then(answers => 
    openSelectedEditor(answers.selected)
  ).catch(error => {
    console.log(chalk.red('An error occurred: ', error))
  });
}

export { create }