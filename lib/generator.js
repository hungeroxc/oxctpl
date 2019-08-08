const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = (metadata = {}, src, dest = '.') => {
    if(!src) {
        return Promise.reject(new Error(`无效的source: ${src}`))
    }

    return new Promise((resolve, reject) => {
        metalsmith(process.cwd())
        .metadata(metadata)
        .clean(false)
        .source(src)
        .destination(dest)
        .use((files, metalsmith, done) => {
            const meta = metalsmith.metadata()
            Object.keys(files).forEach(fileName => {
                const t = files[fileName].contents.toString()
                files[fileName].contents = Buffer.from(handlebars.compile(t)(meta))
            })
            // @ts-ignore
            done()
        })
        .build(err => {
            rm(src)
            err ? reject(err) : resolve({ dest })
        })
    })


}
