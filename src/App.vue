<template>
  <div id="app">
    <LoadWallpaper />
    <Header />
    <main>
      <div class="side">
        <Category />
      </div>
      <div class="content">
        <Display />
      </div>
    </main>
  </div>
</template>

<script>
import LoadWallpaper from './components/LoadWallpaper'
import Category from './components/Category'
import Header from './components/Header'
import Display from './components/Display'

export default {
  components: {
    LoadWallpaper,
    Category,
    Header,
    Display
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  main {
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
    .side {
      border-right: 1px solid #DCDFE6;
    }
    .content {
      flex: 1;
      height: 100%;
      overflow: scroll;
    }
  }
}
</style>
