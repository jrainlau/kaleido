<template>
  <main>
    <div class="content">
      <PreloadDisplay />
    </div>
  </main>
</template>

<script>
import PreloadDisplay from '../components/PreloadDisplay'

export default {
  components: {
    PreloadDisplay
  }
}
</script>

<style lang="less" scoped>
main {
  height: 100%;
  padding-top: 60px;
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
  .content {
    flex: 1;
    height: 100%;
    overflow: scroll;
  }
}
</style>
