# vue-pdf-search-preview

## Step1 Install
```
npm install --save vue-pdf-search-preivew
```

## Step2 Config webpack or vue.config(below is vue.config)
```
//vue.config.js

module.exports = {
   chainWebpack: config => {
   
    //...your configs
    
    config
      .plugin('copy')
      .tap(args => {
        args[0].push(
          {
            context: 'node_modules/vue-pdf-search-viewer/lib/',
            from: '*.umd.min.*.js',
            to: 'js/',
            toType: 'dir'
          },
          {
            from: 'node_modules/vue-pdf-search-viewer/lib/pdf.worker.js',
            to: 'pdf.worker.js',
            toType: 'file'
          },
        )
        return args
      })
  }
}
```
## Step3 Import and register
```
//main.js

import PdfViewer from 'vue-pdf-search-viewer'

Vue.use(PdfViewer)
```

## Example
```
<template>
  <pdf-viewer src="./compressed.tracemonkey-pldi-09.pdf"></<pdf-viewer>
</template>
 
```
## API