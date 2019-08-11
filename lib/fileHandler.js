const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

module.exports = projectName => {
    const list = fs.readdirSync('.')
    const rootName = path.basename(process.cwd())
    let next = undefined

    if(!!list.length) {
        // 获取当前目录下是否存在和项目名字相同的文件夹
        const sameNameArray = list.filter(name => {
            const fileName = path.resolve(process.cwd(), path.join('.', name))
            const isDir = fs.statSync(fileName).isDirectory()
            return name.indexOf(projectName) !== -1 && isDir
        })
        // 存在相同目录的同时退出进程
        if(sameNameArray.length > 0) {
            console.log(`项目${projectName}已经存在`)
            process.exit()
        }
        // 不存在时处理, 此为正常情况
        next = Promise.resolve(projectName)
    } else if(rootName === projectName) {
        // 如果当前目录名称和项目名相同，则在改目录下生成项目
        next = inquirer.prompt([
            {
                name: 'buildInCurrent',
                message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
                type: 'confirm'
            }
        ]).then(answer => {
            return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
        })
    } else {
        // 正常情况
        next = Promise.resolve(projectName)
    }
    return next
}
