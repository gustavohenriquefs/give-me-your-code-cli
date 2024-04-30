#! /usr/bin/env node
import { program } from 'commander'

import { list } from './commands/list.js'
import { add } from './commands/add.js'
import { save } from './commands/save.js'
import { db } from './db.config.js'

db.sequelize.sync()
  .then(() => {});

program.command('list')
        .description('List all templates')
        .action(list)
        
program.command('add')
        .description('Add a new template')
        .option('-t, --template <templateName>', 'template name')
        .option('-d, --description <description>', 'description')
        .option('-f, --file <fileName>', 'file name')
        .action((options) => add(options))

program.command('save')
        .description('Save a new template')
        .option('-t, --template <templateName>', 'template name')
        .option('-d, --description <description>', 'description')
        .option('-f, --file <fileName>', 'file name')
        .action((options) => save(options))

program.parse()