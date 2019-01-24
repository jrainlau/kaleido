<template>
  <div class="display">
    <Pagination />
    <el-row :gutter="15">
      <template v-for="(wallpaper, index) in onShowWallpapers">
        <el-col :span="12" :key="index">
          <Wallpaper :wallpaper="wallpaper" />
        </el-col>
      </template>
    </el-row>
    <Pagination />
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
  }
}
</script>

<style lang="less">
.display {
  box-sizing: border-box;
  padding: 10px;
  background: #eee;
  min-height: 100%;
}
</style>
