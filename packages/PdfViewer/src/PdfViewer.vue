<template>
  <div class="viewer-container" ref="container">
    <div class="pdfViewer" ref="viewer"></div>
  </div>
</template>

<script>
import PDFLib from 'pdfjs-dist'
import { PDFLinkService, PDFFindController, PDFViewer, EventBus } from 'pdfjs-dist/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'

PDFLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js'
let pdfViewer, pdfLoadingTask

export default {
  name: 'PdfViewer',
  props: {
    src: {
      type: String,
      required: true,
    },
    autoWidth: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.initViewer()
  },
  beforeDestroy() {
    pdfViewer.eventBus.off('updatefindmatchescount', this.handleMatchResult)
    pdfViewer.eventBus.off('updatefindcontrolstate', this.handleSearchStateChange)
    pdfViewer.eventBus.off('pagechanging', this.handlePageChange)
    pdfViewer.eventBus.off('pagesinit', this.handleLoadPDF)

    pdfLoadingTask.destroy()
    pdfViewer = null
    pdfLoadingTask = null
  },
  methods: {
    initViewer() {
      const eventBus = new EventBus()
      const linkService = new PDFLinkService({ eventBus })
      const findController = new PDFFindController({ eventBus, linkService })

      pdfViewer = new PDFViewer({
        container: this.$refs.container,
        eventBus,
        findController,
        linkService,
      })
      linkService.setViewer(pdfViewer)

      pdfViewer.eventBus.on('updatefindmatchescount', this.handleMatchResult)
      pdfViewer.eventBus.on('updatefindcontrolstate', this.handleSearchStateChange)
      pdfViewer.eventBus.on('pagechanging', this.handlePageChange)
      pdfViewer.eventBus.on('pagesinit', this.handleLoadPDF)

      pdfLoadingTask = PDFLib.getDocument({ url: this.src })

      pdfLoadingTask.promise.then((pdfDoc) => {
        pdfViewer.setDocument(pdfDoc)
        linkService.setDocument(pdfDoc)
        this.$emit('on-loaded', pdfDoc.numPages)
      })
    },
    handleMatchResult(e) {
      this.$emit('on-search', e.matchesCount)
    },
    handleSearchStateChange(e) {
      if (e.previous !== false) return
      const { _matchesCountTotal, state } = e.source
      const { isMatchChinese, query } = state
      if (_matchesCountTotal === 0 && !isMatchChinese) this.search(query, true)
    },
    handlePageChange(e) {
      this.$emit('on-page-change', e.pageNumber)
    },
    handleLoadPDF() {
      if (this.autoWidth) this.zoom('auto')
    },
    zoom(scale) {
      if (scale !== 'auto') return pdfViewer.currentScaleValue = scale
      pdfViewer.currentScaleValue = 'page-width'
    },
    isChinese(char) {
      return /[\u4e00-\u9fa5]+/.test(char)
    },
    isNumberOrLetter(char) {
      return /[0-9a-zA-Z]+/.test(char)
    },
    matchChinese(keyword) {
      let newKeyword = ''
      for (let i = 0; i < keyword.length; i++) {
        let char = keyword[i]
        const nextChar = keyword[i + 1]
        if (this.isChinese(char) && nextChar && this.isNumberOrLetter(nextChar)) char += ' '
        newKeyword += char
      }
      return newKeyword
    },
    search(keyword, isMatchChinese) {
      let newKeyword = keyword
      if (isMatchChinese) newKeyword = this.matchChinese(keyword)
      pdfViewer.findController.executeCommand('find', {
        caseSensitive: true,
        phraseSearch: true,
        query: newKeyword,
        findPrevious: false,
        highlightAll: true,
        isMatchChinese,
      })
    },
    searchAgain(keyword, prev) {
      pdfViewer.findController.executeCommand('findagain', {
        caseSensitive: true,
        phraseSearch: true,
        query: keyword,
        findPrevious: prev,
        highlightAll: true,
      })
    },
    cancelSearch() {
      pdfViewer.findController._onFindBarClose()
      this.$emit('on-search', { current: 0, total: 0 })
    },
    jumpToPage(page) {
      pdfViewer.currentPageNumber = page
    },
  },
}
</script>

<style lang="sass">
  .viewer-container
    overflow-x: hidden
    overflow-y: auto
    padding: 24px
    position: absolute
    box-sizing: border-box
    width: 100%
    height: 100%
    .pdfViewer .page
      border: none
      margin: 16px auto 0
      &:first-of-type
        margin-top: 0
</style>
