<template>
  <div class="display">
    <el-row :gutter="15">
      <template v-for="(wallpaper, index) in allPreloadWallpapers">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :key="index">
          <Wallpaper :wallpaper="wallpaper" />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Wallpaper from './Wllpaper'

export default {
  components: {
    Wallpaper
  },
  computed: {
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
