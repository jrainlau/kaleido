<template>
  <div id="app">
    <LoadWallpaper />
    <Header />
    <router-view v-loading="loading"></router-view>
  </div>
</template>

<script>
import LoadWallpaper from './components/LoadWallpaper'
import Header from './components/Header'
import { mapState } from 'vuex'

export default {
  components: {
    LoadWallpaper,
    Header
  },
  computed: {
    ...mapState(['loading'])
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
