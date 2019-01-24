<template>
  <div class="display">
    <i ref="target"></i>
    <el-row :gutter="15">
      <template v-for="(wallpaper, index) in onShowWallpapers">
        <el-col :span="12" :key="index">
          <Wallpaper :wallpaper="wallpaper" />
        </el-col>
      </template>
    </el-row>
    <Pagination @current-page-change="scrollTop" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Wallpaper from './Wllpaper'
import Pagination from './Pagination'

export default {
  components: {
    Wallpaper,
    Pagination
  },
  computed: {
    ...mapState(['onShowWallpapers'])
  },
  methods: {
    scrollTop () {
      document.querySelector('.content').scrollTop = 0
    }
  }
}
</script>

<style lang="less" scoped>
.display {
  box-sizing: border-box;
  background: #eee;
  padding: 10px;
  min-height: 100%;
}
</style>
