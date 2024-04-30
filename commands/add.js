import chalk from 'chalk'
import { spawn, exec } from 'child_process'
import tmp from 'tmp'
import fs from 'fs'
import inquirer from 'inquirer'
import { addTemplate } from '../controllers/template.controller.js'

function add(options) {
  selectCodeEditor(options)
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

function spawnVimEditor(filePath, vimPath) {
  const command = vimPath.path
  return spawn(command, [filePath], {
    stdio: 'inherit'
  })
}

function saveTemplate(fileData) {
  addTemplate({
    name: fileData.template ? fileData.template : fileData.path,
    description: fileData.description ? fileData.description : '',
    files: [
      {
        name: fileData.file ? fileData.file : 'main.cpp',
        content: fileData.content
      }
    ]
  })
  .then()
  .catch((err) => {
    console.log(
      chalk.red('An error occurred: ', err)
    )
  })
  .finally(() => {
    console.log(
      chalk.green.bold('Template saved!')
    )
  })
}

function processFileDataVim(filePath, options) {
  fs.promises.readFile(filePath, 'utf8')
    .then((data) => {
      const templateData = {}

      templateData.content = data
      templateData.path = filePath
      templateData.file = options.file
      templateData.template = options.template
      templateData.description = options.description

      saveTemplate(templateData)
    })
    .catch((err) => {
      console.log(
        chalk.red('An error occurred: ', err)
      )
    })
}

function closeEditedFileVim(childProcess, filePath, options) {
  childProcess.on('exit', (e, code) => 
    processFileDataVim(filePath, options)
  )
}

function getVimOrNvimPathWin() {
  const envPath = process.env.PATH || ''
  const vimPath = envPath.split(';')
    .find(path => path.includes('vim'))

  const isNeovim = vimPath.includes('Neovim')

  return { 
    editor: isNeovim ? 'nvim' : 'vim', 
    path: `${vimPath}\\${vimPath.editor}.exe`
  }
}

function getVimOrNvimLinux() {
  const vimPath = '/usr/bin/vim'
  const nvimPath = '/usr/bin/nvim'

  const isVim = fs.existsSync(vimPath)

  return isVim ? 
    { editor: 'vim', path: `${vimPath}` } : 
    { editor: 'nvim', path: nvimPath }
}

function getVimPath() {
  if(process.platform === 'win32') {
    return getVimOrNvimPathWin()
  } 

  return getVimOrNvimLinux()
}

function addTemplateUsingVim(options) {
  const vimPath = getVimPath()

  tmp.file((err, filePath, fd, cleanupCallback) => {
    if(err) {
      console.log(
        chalk.red('An error occurred: ', err)
      )

      cleanupCallback()

      return
    }

    try {
      const child = spawnVimEditor(filePath, vimPath)
  
      closeEditedFileVim(child, filePath, options)
    } catch (error) {
      console.log(
        chalk.red('An error occurred: ', error)
      )
    } finally {
      cleanupCallback()
    }
  })
}

function redirectToVsCode(options) {
  const { template, file } = options

  const path = `./${template ? template : 'tmp'}/${file ? file : 'main.cpp'}`

  exec(`code ${path}`, (err, stdout, stderr) => {
    if(err) {
      console.log(
        chalk.red('An error occurred: ', err)
      )
    }

    chalk.blue.bold('Redirecting to VsCode...')
  })
}

function openSelectedEditor(editorName, options) {
  const editors = getEditors()
  const editorData = editors
    .find(editorData => editorData.editor === editorName)

  if(!editorData) {
    console.log(
      chalk.red('Editor not found')
    )

    return
  }

  if(editorData.editor === 'vim') 
    addTemplateUsingVim(options)
  else if(editorData.editor === 'vscode') 
    redirectToVsCode(options)

  if(editorData.needSaveCommand) {
    console.log(
      chalk.yellow.bold(
        'After saving the file, run the command: gmyc save -t <template-name> -d <description> -f <file-name> to save the template'
      )
    )
  }
}

function selectCodeEditor(options) {
  const editors = getEditors()

  const editorsName = editors.map(editorData => editorData.editor)

  inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Choose a template:',
      choices: editorsName
    }
  ]).then(answers => 
    openSelectedEditor(answers.selected, options)
  ).catch(error => {

    console.log(
      chalk.red('An error occurred: ', error)
    )

  })
}

export { add }