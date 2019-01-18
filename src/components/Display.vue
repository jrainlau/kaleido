<template>
  <div class="display">
    <Pagination />
    <el-row :gutter="15">
      <template v-for="(wallpaper, index) in onShowWallpapers">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :key="index">
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
