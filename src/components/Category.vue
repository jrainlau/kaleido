<template>
  <div class="category">
    <el-input
      class="category-search"
      placeholder="Search..."
      clearable
      prefix-icon="el-icon-search"
      size="medium"
      v-model="filterText"
    ></el-input>
    <el-tree
      ref="category"
      :data="categories"
      :highlight-current="true"
      :filter-node-method="filterNode"
      accordion
      @node-click="selectCate">
    </el-tree>
    <div class="category-resolutions">
      <Resolutions />
    </div>
  </div>
</template>

<script>
import categories from '../assets/category.js'
import Resolutions from './Resolutions'

const BASE_DOMAIN = 'http://wallpaperswide.com'

export default {
  components: {
    Resolutions
  },
  data () {
    return {
      filterText: '',
      categories
    }
  },
  watch: {
    filterText (val) {
      this.$refs['category'].filter(val)
    }
  },
  methods: {
    selectCate (data) {
      const cateName = data.label.toLowerCase().replace(/\s+/g, '_')
      console.log(cateName)
      const newSrc = `${BASE_DOMAIN}/${cateName}-desktop-wallpapers/page/1`
      this.$store.commit('UPDATE_WEBVIEW_SRC', newSrc)
      this.$store.commit('RESET_SELECTED_ON_SHOW_WALLPAPERS')
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="less" scoped>
.category {
  position: relative;
  height: 100%;
  padding: 10px;
  padding-top: 0px;
  margin-top: 10px;
  overflow-y: scroll;
  width: 240px;
  box-sizing: border-box;
  &-search {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  &-resolutions {
    border-top: 1px solid #DCDFE6;
    margin-top: 5px;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
