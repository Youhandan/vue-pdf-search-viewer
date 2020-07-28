module.exports = {
  css: { extract: false },
  chainWebpack: config => {
    config.module
      .rule('worker')
        .test(/\.worker.js$/)
        .use('worker')
          .loader('worker-loader')
          .options({
            inline: true,
            name: 'pdf.worker.js'
          })
    config.module
      .rule('js')
        .include
          .add(__dirname + '/packages')
          .end()
  }
}

