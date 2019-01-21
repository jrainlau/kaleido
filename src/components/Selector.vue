<template>
  <div class="selector">
    <span class="selector-desc" :class="{'checked': allChecked}">{{onShowSelectedWallpapers.length}}/{{onShowWallpapers.length}}</span>
    <div class="selector-checkbox" :class="{'checked': allChecked}" @click="selectAll">
      <i v-show="allChecked" class="el-icon-check selector-checkbox-center"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      id: (Math.random() * 100000).toFixed(0)
    }
  },
  computed: {
    ...mapState(['onShowWallpapers', 'preloadWallpapers']),
    ...mapGetters(['onShowSelectedWallpapers']),
    allChecked () {
      return this.onShowWallpapers.length && this.onShowSelectedWallpapers.length === this.onShowWallpapers.length
    }
  },
  methods: {
    selectAll () {
      if (!this.allChecked) {
        this.$store.commit('SELECT_ALL_ON_SHOW_WALLPAPERS')
      } else {
        this.$store.commit('DELETE_ALL_SELECTED_ON_SHOW_WALLPAPERS')
      }
    }
  }
}
</script>

<style lang="less" scope>
.selector {
  display: flex;
  align-items: center;
  transition: all .3s ease;
  user-select: none;
  margin: 0 15px;
  &-checkbox {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 4px;
    margin: 0 5px;
    box-sizing: border-box;
    border: 2px solid #DCDFE6;
    border-radius: 100%;
    &.checked {
      border-color: #409EFF;
    }
    &-center {
      position: absolute;
      top: 0;
      left: 0;
      font-weight: bold !important;
      color: #409EFF;
    }
  }
  &-desc {
    color: #DCDFE6;
    &.checked {
      color: #409EFF;
    }
  }
}
</style>
