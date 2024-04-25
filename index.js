#! /usr/bin/env node
import { program } from 'commander'

import { list } from './commands/list.js'
import { create } from './commands/create.js'

program.command('list')
        .description('List all templates')
        .action(list)

program.command('create')
        .description('Create a new template')
        .action(create)

program.parse()