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

export default {
  name: 'PdfViewer',
  pdfViewer: null,
  pdfLoadingTask: null,
  props: {
    src: {
      type: String,
      required: true
    },
    autoWidth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      realKeyword: ''
    }
  },
  mounted() {
    this.initViewer()
  },
  beforeDestroy() {
    this.pdfViewer.eventBus.off('updatefindmatchescount', this.handleMatchResult)
    this.pdfViewer.eventBus.off('updatefindcontrolstate', this.handleSearchStateChange)
    this.pdfViewer.eventBus.off('pagechanging', this.handlePageChange)
    this.pdfViewer.eventBus.off('pagesinit', this.handleLoadPDF)

    this.pdfLoadingTask.destroy()
    this.pdfViewer = null
    this.pdfLoadingTask = null
  },
  methods: {
    initViewer() {
      const eventBus = new EventBus()
      const linkService = new PDFLinkService({ eventBus })
      const findController = new PDFFindController({ eventBus, linkService })

      this.pdfViewer = new PDFViewer({
        container: this.$refs.container,
        eventBus,
        findController,
        linkService
      })
      linkService.setViewer(this.pdfViewer)

      this.pdfViewer.eventBus.on('updatefindmatchescount', this.handleMatchResult)
      this.pdfViewer.eventBus.on('updatefindcontrolstate', this.handleSearchStateChange)
      this.pdfViewer.eventBus.on('pagechanging', this.handlePageChange)
      this.pdfViewer.eventBus.on('pagesinit', this.handleLoadPDF)

      this.pdfLoadingTask = PDFLib.getDocument({ url: this.src })

      this.pdfLoadingTask.promise.then((pdfDoc) => {
        this.pdfViewer.setDocument(pdfDoc)
        linkService.setDocument(pdfDoc)
        this.$emit('on-loaded', pdfDoc.numPages)
      })
    },
    handleMatchResult(e) {
      let matchesCount = { ...e.matchesCount }
      const { _matchesCountTotal } = e.source
      if (_matchesCountTotal > 0 && matchesCount.total === 0) {
        matchesCount = { current: 1, total: _matchesCountTotal }
      }
      this.$emit('on-search', matchesCount)
    },
    handleSearchStateChange(e) {
      if (e.previous !== false) return
      const { isMatchChinese, query } = e.source.state
      // e.state === 1 means there's no match result
      if (e.state === 1 && !isMatchChinese) this.search(query, true)
    },
    handlePageChange(e) {
      this.$emit('on-page-change', e.pageNumber)
    },
    handleLoadPDF() {
      if (this.autoWidth) this.zoom('auto')
    },
    zoom(scale) {
      if (scale !== 'auto') return this.pdfViewer.currentScaleValue = scale
      this.pdfViewer.currentScaleValue = 'page-width'
    },
    isChinese(char) {
      return /[\u4e00-\u9fa5]+/.test(char)
    },
    isNumberLetterOrSpace(char) {
      return char === ' ' || /[0-9a-zA-Z]+/.test(char)
    },
    matchChinese(keyword) {
      let newKeyword = ''
      for (let i = 0; i < keyword.length; i++) {
        let char = keyword[i]
        const nextChar = keyword[i + 1]
        if (this.isChinese(char) && nextChar && this.isNumberLetterOrSpace(nextChar)) char += ' '
        newKeyword += char
      }
      return newKeyword
    },
    search(keyword, isMatchChinese) {
      let newKeyword = keyword
      if (isMatchChinese) newKeyword = this.matchChinese(keyword)
      this.realKeyword = newKeyword
      this.pdfViewer.findController.executeCommand('find', {
        caseSensitive: true,
        phraseSearch: true,
        query: newKeyword,
        findPrevious: false,
        highlightAll: true,
        isMatchChinese
      })
    },
    searchAgain(prev) {
      this.pdfViewer.findController.executeCommand('findagain', {
        caseSensitive: true,
        phraseSearch: true,
        query: this.realKeyword,
        findPrevious: prev,
        highlightAll: true,
      })
    },
    cancelSearch() {
      this.pdfViewer.findController._onFindBarClose()
      this.$emit('on-search', { current: 0, total: 0 })
    },
    jumpToPage(page) {
      this.pdfViewer.currentPageNumber = page
    }
  }
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
