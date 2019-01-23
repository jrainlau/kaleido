<template>
  <main>
    <div class="side">
      <Category />
    </div>
    <div class="content">
      <Display />
    </div>
  </main>
</template>

<script>
import Category from '../components/Category'
import Display from '../components/Display'

export default {
  components: {
    Category,
    Display
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
  .side {
    border-right: 1px solid #DCDFE6;
  }
  .content {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
