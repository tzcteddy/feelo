#!/usr/bin/env node
import { Command } from "commander";
const program=new Command()
 program.version(require('../package.json').version,'-v,--version','output the current version')

 program.command('create')
        .action((...arg)=>{
            console.log('create')
        })
program.parse()