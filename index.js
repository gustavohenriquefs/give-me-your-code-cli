#! /usr/bin/env node
import { program } from 'commander'

import { list } from './commands/list.js'
import { create } from './commands/create.js'
import { db } from './db.config.js'

db.sequelize.sync({ force: true })
  .then(() => {});

program.command('list')
        .description('List all templates')
        .action(list)

program.command('create')
        .description('Create a new template')
        .action(create)

program.parse()