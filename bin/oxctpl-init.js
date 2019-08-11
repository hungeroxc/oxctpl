#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')

const download = require('./../lib/download')
const generator = require('./../lib/generator')
const fileHandler = require('./../lib/fileHandler')

program
.usage('<project-name>')
.parse(process.argv)

const projectName = program.args[0]

// projectName必填
if(!projectName) {
    program.help()
}

const next = fileHandler(projectName)

next && go()

function go() {
    next.then(projectName => {
        // 创建隐藏文件夹，并将模板下载至该文件夹
        if(projectName !== '.') {
            fs.mkdirSync(projectName)
        }
        return download(projectName).then(target => {
            return {
                name: projectName,
                downloadTemp: target
            }
        })
    }).then(context => {
        // 填入基础信息
        return inquirer.prompt([
            {
                name: 'projectName',
                message: '项目名称',
                default: context.name
            },
            {
                name: 'projectVersion',
                message: '项目的版本号',
                default: '1.0.0'
            },
            {
                name: 'projectDescription',
                message: '项目的简介',
                default: `A project named ${context.name}`
            }
        ]).then(answers => {
            const info = {
                ...context,
                metadata: { ...answers }
            }
            return generator(info.metadata, info.downloadTemp, path.parse(info.downloadTemp).dir)
        }).then(context => {
            console.log('创建成功')
            console.log()
            // @ts-ignore
            console.log(chalk.green('cd ' + context.dest + '\nnpm i\nnpm run dev'))
        }).catch(err => {
            // @ts-ignore
            console.log(chalk.red(`found faild：${err.message}`))
        })
    })

}

