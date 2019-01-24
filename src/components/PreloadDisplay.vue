<template>
  <div class="display">
    <el-row :gutter="15">
      <template v-for="(wallpaper, index) in allPreloadWallpapers">
        <el-col :span="6" :key="index">
          <Wallpaper :wallpaper="wallpaper" />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Wallpaper from './Wllpaper'

export default {
  components: {
    Wallpaper
  },
  computed: {
    ...mapState(['loading']),
    ...mapGetters(['allPreloadWallpapers'])
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
