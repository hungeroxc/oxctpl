const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

// direct用于直接传递url，不进行规范检测
const downloadUrl = 'direct:https://github.com/hungeroxc/oxc-tpl.git#master'

module.exports = target => {
    target = path.join(target || '.', '.download-temp')
    return new Promise((resolve, reject) => {
        const spinner = ora(`正在下载模板, 源地址${downloadUrl.replace('direct:', '')}`)
        spinner.start()
        download(downloadUrl, target, {clone: true}, err => {
            if(err) {
                spinner.fail()
                reject(err)
            } else {
                // 下载完毕后模板扔到临时路径, 然后通知出去进行处理
                spinner.succeed()
                resolve(target)
            }
        })
    })
}

