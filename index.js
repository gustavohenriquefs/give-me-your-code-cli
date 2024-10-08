#! /usr/bin/env node
import { program } from 'commander'

import { list } from './commands/list.js'
import { add } from './commands/add.js'
import { save } from './commands/save.js'
import { use } from './commands/use.js'
import { edit } from './commands/edit.js'
import { db } from './db.config.js'
import chalk from 'chalk';

await db.sequelize.sync()
        .then()
        .catch((err) => {
                console.log(
                        chalk.red('Error creating database: '), err
                )
        });

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

program.command('use')
        .description('Use a template')
        .action(() => use())

program.command('edit')
        .description('Edit a template')
        .option('-t, --template <templateName>', 'template name')
        .action((options) => edit(options))

program.parse()