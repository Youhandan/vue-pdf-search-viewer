module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
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
    config.resolve.alias
      .delete('@')
    if(process.env.NODE_ENV === 'production') {
      config.module
        .rule('js')
          .include
            .add(__dirname + '/packages')
            .end()
    } else {
      config.resolve.alias
        .set('examples', __dirname + '/examples')
        .set('packages', __dirname + '/packages')
      config.module
        .rule('js')
        .include
          .add(__dirname + '/examples')
          .end()
    }
  }
}

