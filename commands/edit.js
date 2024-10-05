import fs from 'fs';
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { selectTemplate } from '../controllers/template.controller.js';
import { getTemplateByName, updateTemplate } from '../dao/template.dao.js';
import { getVimPath, spawnVimEditor } from '../shared/utils.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para criar um diretório temporário
function createTempDir(templateName) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), templateName + '-'));
  console.log(`Diretório temporário criado: ${tempDir}`);
  return tempDir;
}

// Função para adicionar arquivos no diretório
function addFilesToTempDir(dir, files) {
  files.forEach((file) => {
    const filePath = path.join(dir, file.dataValues.name);
    fs.writeFileSync(filePath, file.dataValues.content || '');
    console.log(`Arquivo criado: ${filePath}`);
  });
}

// Função que processa os arquivos do diretório após a edição no Vim
async function processFileDataVim(dirPath, options, selectTemplate) {
  console.log("Selected template:", selectTemplate);
  try {
    // Lê todos os arquivos dentro do diretório
    const files = await fs.promises.readdir(dirPath);
    const templateData = {
      content: '',
      files: [],
      name: selectTemplate.name,
      description: selectTemplate.description
    };

    // Processa cada arquivo individualmente
    for (const fileName of files) {
      const filePath = path.join(dirPath, fileName);
      const data = await fs.promises.readFile(filePath, 'utf8');
      
      console.log(`Data from ${filePath}:`, data);

      // Insere o conteúdo de cada arquivo no template
      templateData.files.push({
        name: fileName,
        content: data
      });
    }

    // Chama a função para atualizar o template com os dados lidos
    updateTemplate(templateData);
  } catch (err) {
    console.log(chalk.red('An error occurred: ', err));
  }
}

// Função para abrir o Vim no diretório temporário
function openVim(dir, options, templateData) {
  const vimPath = getVimPath();

  return new Promise((resolve, reject) => {
    const vim = spawnVimEditor(dir, vimPath);

    vim.on('exit', (code) => {
      if (code === 0) {
        processFileDataVim(dir, options, templateData).then(resolve).catch(reject);
      } else {
        reject(new Error(`Vim exited with code ${code}`));
      }
    });
  });
}

// Função para excluir o diretório temporário
function removeTempDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Diretório temporário removido: ${dir}`);
}

// Função para criar o template temporário e abrir no Vim
async function createTemporalyTemplateToVim(template) {
  const tempDir = createTempDir(template.dataValues.name);

  addFilesToTempDir(tempDir, template.dataValues.files);

  return tempDir;
}

// Função principal para editar templates
async function edit(options) {
  const selectedTemplateName = await selectTemplate();

  const templateSelected = await getTemplateByName(selectedTemplateName);

  console.log('Template selecionado:', templateSelected);

  const tempDir = await createTemporalyTemplateToVim(templateSelected);

  try {
    await openVim(tempDir, options, templateSelected);
    console.log('Arquivos editados com sucesso');
  } catch (error) {
    console.error('Erro ao editar os arquivos:', error);
  } finally {
    removeTempDir(tempDir); // Removendo o diretório temporário após a edição
  }

  // Pode adicionar aqui o código para substituir o template selecionado pelos novos dados
}

export { edit };
