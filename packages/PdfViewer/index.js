import PdfViewer from './src/PdfViewer'

PdfViewer.install = function (Vue) {
  Vue.component(PdfViewer.name, PdfViewer)
}

export default PdfViewer
