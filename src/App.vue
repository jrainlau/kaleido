<template>
  <div id="app">
    <LoadWallpaper />
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import LoadWallpaper from './components/LoadWallpaper'
import Header from './components/Header'

export default {
  components: {
    LoadWallpaper,
    Header
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
