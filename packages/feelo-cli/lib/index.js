#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program.version(require('../package.json').version, '-v,--version', 'output the current version');
program.command('create')
    .action((...arg) => {
    console.log(arg);
});
program.parse();
