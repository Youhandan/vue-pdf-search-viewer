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
| Props | Type | Description |
|-------------|-------------|-------------|
| **src** | string or other(detail to see pdf.js getDocument()) | Pdf url |
| **autoWidth** | boolean, default `false` | Whether to zoom pdf to container width when initial  |

| Events | Parameters | Description |
|-------------|-------------|-------------|
| **on-loaded** |  number | Pdf total page number |
| **on-search** |  object: { current, total } | Search keyword matched current number and total count |
| **on-page-change** |  number | Current page number |

| Methods | Parameters | Description |
|-------------|-------------|-------------|
| **search** |  string | Search keyword in pdf |
| **searchAgain** |  param1:string, param2: boolean  | Param1 is search keyword, param2 is dicided to find pre(true) or find next(false)|
| **cancelSearch** | none | Cancel search |
| **zoom** | number/ string('auto') | Number: The ratio of pdf zoom, 'auto': zoom to container width |
| **jumpToPage** | number | The page number of pdf jumped to  |





