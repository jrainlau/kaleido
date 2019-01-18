<template>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="onshowWallpapers[0] && Number(onshowWallpapers[0].total)"
      :current-page="currentPage"
      @current-change="currentChange"
      @prev-click="stepClick"
      @next-click="stepClick">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    ...mapState(['currentPageAmount', 'currentWebviewSrc', 'onshowWallpapers'])
  },
  methods: {
    currentChange (num) {
      this.currentPage = num
    },
    stepClick (num) {
      this.currentPage = num
    }
  },
  watch: {
    currentPage (val) {
      const newSrc = this.currentWebviewSrc.replace(/page\/\d+/g, `page/${this.currentPage}`)
      this.$store.commit('UPDATE_WEBVIEW_SRC', newSrc)
      this.$store.commit('RESET_SELECTED_ON_SHOW_WALLPAPERS')
    },
    currentWebviewSrc (val) {
      this.currentPage = val.split('page/')[1] ? Number(val.split('page/')[1]) : 1
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}
</style>
