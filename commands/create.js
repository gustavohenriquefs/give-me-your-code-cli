
import { conf } from './index.js';
import chalk from 'chalk';
import { templateList } from '../db/templates.js';
import { spawn } from 'child_process';
import tmp, { file } from 'tmp';
import fs from 'fs/promises';
import child_process from 'child_process';

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

function spawnVimEditor(filePath) {
  return spawn('vim', [filePath], {
    stdio: 'inherit'
  });
}

function saveTemplate(fileData) {
  templateList.push({
    name: 'new-template',
    description: 'New Template',
    files: [
      {
        name: 'main.cpp',
        content: fileData
      }
    ]
  });

  conf.set(templateListKey, templateList);
  const templateListConf = conf.get('templates')
  console.log(templateListConf);
}

function processFileDataVim(filePath, cleanupCallback) {
  fs.readFile(filePath, 'utf8')
    .then((data) => {
      saveTemplate(data);
    })
    .catch((err) => {
      console.log(chalk.red('An error occurred: ', err));
    })  
    .finally(() => {
      console.log(chalk.green.bold('File saved!'));

      cleanupCallback();
    });
}

function closeEditedFileVim(childProcess, filePath, cleanupCallback) {
  childProcess.on('exit', (e, code) => {
    processFileDataVim(filePath, cleanupCallback);
  });
}

function createTemplateInVim() {
  tmp.file((err, filePath, fd, cleanupCallback) => {
    if(err) {
      console.log(chalk.red('An error occurred: ', err))
      return
    }

    const child = spawnVimEditor(filePath);

    closeEditedFileVim(child, filePath, cleanupCallback);
  });
}

function redirectToVsCode() {
  const child = child_process.spawn('code', ['./tmp/template.cpp'], {
    stdio: 'inherit'
  });

  child.on('exit', (e, code) => {
    console.log(chalk.blue.bold('Redirecting to VS Code...'));
  });
}

function openSelectedEditor(editorName) {
  const editors = getEditors()
  const editorData = editors
    .find(editorData => editorData.editor === editorName)

  if(!editorData) {
    console.log(chalk.red('Editor not found'))
    return
  }

  if(editorData.editor === 'vim') 
    createTemplateInVim();
  else if(editorData.editor === 'vscode') 
    redirectToVsCode();

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