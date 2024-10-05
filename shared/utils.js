import fs from 'fs'
import { spawn } from 'child_process'
import tmp from 'tmp'
import chalk from 'chalk'

export function getEditors() {
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

function getVimOrNvimPathWin() {
  const envPath = process.env.PATH || ''
  const vimPath = envPath.split(';')
    .find(path => path.includes('vim'))

  const isNeovim = vimPath.includes('Neovim')

  return `${vimPath}\\${isNeovim ? 'nvim' : 'vim'}.exe`
}

function getVimOrNvimLinux() {
  const vimPath = '/usr/bin/vim'
  const nvimPath = '/usr/bin/nvim'

  const isVim = fs.existsSync(vimPath)

  return isVim ? vimPath : nvimPath
}

export function spawnVimEditor(filePath, vimPath) {
  return spawn(vimPath, [filePath], {
    stdio: 'inherit'
  })
}

export function getVimPath() {
  if (process.platform === 'win32') {
    return getVimOrNvimPathWin()
  }

  return getVimOrNvimLinux()
}


function closeEditedFileVim(childProcess, filePath, options) {
  childProcess.on('exit', (e, code) =>
    processFileDataVim(filePath, options)
  )
}

export function addTemplateUsingVim(options) {
  const vimPath = getVimPath()

  tmp.file((err, filePath, fd, cleanupCallback) => {
    if (err) {
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
