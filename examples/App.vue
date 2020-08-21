<template>
  <div class="pdf-preview-wrapper">
    <div class="action-bar flex-row-space-between">
      <div class="main-controller flex-row-vertical-center">
        <el-popover
          v-model="showSearchBar"
          placement="bottom"
          width="376"
          trigger="manual"
          popper-class="pdf-search-popover"
        >
          <i slot="reference" :class="['icon-search', 'el-icon-search' , {'active': showSearchBar}]" @click="toggleShowSearchBar"></i>
          <div class="search-bar flex-row-space-between">
            <el-input
              v-model="keyword"
              ref="searchInput"
              @keyup.native.enter="handleMatchChange(false, canFindNext)"
            ></el-input>
            <div class="icon-wrapper flex-row-space-between">
              <i :class="['el-icon-back', {'active': canFindPre}]" @click="handleMatchChange(true, canFindPre)"></i>
              <i :class="['el-icon-right', {'active': canFindNext}]" @click="handleMatchChange(false, canFindNext)"></i>
            </div>
          </div>
        </el-popover>
        <i :class="['el-icon-arrow-left', {'active': canPageDown}]" @click="handlePageChange(-1, canPageDown)"></i>
        <div class="page-num-wrapper">
          <input
            ref="pageInput"
            class="page-input"
            :value="currentPage"
            @keyup.enter="handlePageChangeByInput"/>
          <span>/ {{ pages }}</span>
        </div>
        <i :class="['el-icon-arrow-right', {'active': canPageUp}]" @click="handlePageChange(1, canPageUp)"></i>
      </div>

      <div class="scale-controller flex-row-vertical-center">
        <i :class="['el-icon-minus', {'active': canNarrow}]" @click="handleScaleChange(-25, canNarrow)"></i>
        <span class="scale-percent">{{ currentScale }}%</span>
        <i :class="['el-icon-plus', {'active': canEnlarge}]" @click="handleScaleChange(25, canEnlarge)"></i>
      </div>

      <div class="cancel-wrapper">
        <i class="el-icon-close" @click="$emit('on-close')"></i>
      </div>
    </div>

    <div class="pdf-container">
      <pdf-viewer
        ref="pdfViewer"
        :src="src"
        @on-loaded="updateTotalPages"
        @on-search="handleSearchResult"
        @on-page-change="handlePageChangeFromPDFViewer($event, true)"
      ></pdf-viewer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      src: './compressed.tracemonkey-pldi-09.pdf',
      minScale: 50,
      maxScale: 200,
      currentScale: 100,
      pages: 0,
      currentPage: 1,
      showSearchBar: false,
      keyword: '',
      currentMatch: 0,
      totalMatch: 0
    }
  },
  computed: {
    canEnlarge() {
      return this.currentScale < this.maxScale
    },
    canNarrow() {
      return this.currentScale > this.minScale
    },
    canPageUp() {
      return this.currentPage < this.pages
    },
    canPageDown() {
      return this.currentPage > 1
    },
    canFindPre() {
      return this.currentMatch > 1
    },
    canFindNext() {
      return this.currentMatch < this.totalMatch
    }
  },
  watch: {
    keyword(newVal) {
      this.$refs.pdfViewer.cancelSearch()
      if (newVal) this.$refs.pdfViewer.search(newVal)
    },
    showSearchBar(newVal) {
      if (newVal) this.$nextTick(() => this.$refs.searchInput.focus())
      else this.$refs.pdfViewer.cancelSearch()
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        this.showSearchBar = true
        e.preventDefault()
      } else if (e.key === 'Escape') {
        this.showSearchBar = false
      }
    }
  },
  methods: {
    toggleShowSearchBar() {
      this.showSearchBar = !this.showSearchBar
    },
    updateTotalPages(pages) {
      this.pages = pages
    },
    handleScaleChange(value, changeable) {
      if (changeable) {
        this.currentScale += value
        this.$refs.pdfViewer.zoom(this.currentScale / 100)
      }
    },
    handlePageChange(value, changeable) {
      if (changeable) this.currentPage += value
      this.$refs.pdfViewer.jumpToPage(this.currentPage)
    },
    handlePageChangeFromPDFViewer(page) {
      this.currentPage = page
    },
    handlePageChangeByInput() {
      const el = this.$refs.pageInput;
      if (isNaN(el.value.trim())) return this.$message.error(this.$t('error.wrongPageNumber'))
      const page = parseFloat(el.value.trim())
      if (page < 1 || page > this.pages || page % 1 !== 0) return this.$message.error(this.$t('error.wrongPageNumber'))
      el.blur()
      this.currentPage = page
      this.$refs.pdfViewer.jumpToPage(this.currentPage)
    },
    handleMatchChange(prev, changeable) {
      if (changeable) {
        this.$refs.pdfViewer.searchAgain(prev)
        this.currentMatch += prev ? -1 : 1
      }
    },
    handleSearchResult({ current, total }) {
      this.currentMatch = current
      this.totalMatch = total
    }
  }
}
</script>

<style scoped lang="sass">
  .flex-row-space-between
    display: flex
    justify-content: space-between
    align-items: center
  .flex-row-vertical-center
    display: flex
    align-items: center
  .pdf-preview-wrapper
    width: 100vw
    height: 100vh
    position: fixed
    top: 0
    left: 0
    color: #606470
    .action-bar
      height: 60px
      background-color: #1B2539
      padding: 0 24px
      i
        font-size: 20px
      .active
        color: white
        cursor: pointer
      .main-controller
        width: 30%
        .icon-search
          margin-right: 24px
          cursor: pointer
          &:focus
            outline: none
          &.active
            color: #6595FF
        .page-num-wrapper
          margin: 0 16px
          .page-input
            width: 50px
            height: 28px
            padding: 7px 8px
            margin-right: 8px
            text-align: right
            outline: none
            color: white
            background-color: #1B2539
            box-sizing: border-box
            border: 1px solid rgba(96, 100, 112, 0.50)
            border-radius: 2px
      .scale-controller
        .scale-percent
          width: 40px
          text-align: center
          margin: 0 16px
          color: white
      .cancel-wrapper
        width: 30%
        text-align: right
        i
          color: white
          cursor: pointer
    .pdf-container
      width: 100%
      height: calc(100% - 60px)
      position: relative
      box-sizing: border-box
      background: rgba(53, 50, 48, 0.80)
</style>

<style lang="sass">
  .pdf-search-popover.el-popover
    padding: 8px 0 8px 8px
    background-color: #293247
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.50)
    border: none
    .search-bar
      .el-input
        width: 280px
        .el-input__inner
          height: 32px
          background-color: #1B2539
          border: 1px solid rgba(96, 100, 112, 0.50)
          color: white
          &:focus
            border: 1px solid #6595FF
    .icon-wrapper
      width: 56px
      margin: 0 16px
      i
        font-size: 20px
        &.active
          color: white
          cursor: pointer
    .popper__arrow
      border-bottom-color: #293247 !important
      &::after
        border-bottom-color: #293247 !important
</style>
