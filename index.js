#! /usr/bin/env node
import { program } from 'commander'

import { list } from './commands/list.js'

program.command('list')
        .description('List all templates')
        .action(list)

program.parse()