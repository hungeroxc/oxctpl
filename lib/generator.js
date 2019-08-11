const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = (metadata = {}, src, dest = '.') => {
    if(!src) {
        return Promise.reject(new Error(`无效的source: ${src}`))
    }

    return new Promise((resolve, reject) => {
        metalsmith(process.cwd())
        // 获取元信息
        .metadata(metadata)
        // 写入前不删除目标目录
        .clean(false)
        // 设置源路径和目标路径
        .source(src)
        .destination(dest)
        // 中间操作，使用handlebars进行模板解析
        .use((files, metalsmith, done) => {
            const meta = metalsmith.metadata()
            Object.keys(files).forEach(fileName => {
                const t = files[fileName].contents.toString()
                files[fileName].contents = Buffer.from(handlebars.compile(t)(meta))
            })
            // @ts-ignore
            done()
        })
        // 创建
        .build(err => {
            rm(src)
            err ? reject(err) : resolve({ dest })
        })
    })


}
