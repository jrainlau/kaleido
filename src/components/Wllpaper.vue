<template>
  <div class="wallpaper" @click="pickThis(wallpaper)">
    <img :src="wallpaper.thumb" alt="">
    <h3 class="wallpaper-title">{{wallpaper.name | formatter}}</h3>
    <div class="wallpaper-selector" v-show="checked">
      <i class="el-icon-check"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  filters: {
    formatter (val) {
      return val.split('_').map(word => word.replace(/^\S/, (s) => s.toUpperCase())).join(' ')
    }
  },
  props: {
    wallpaper: {
      type: Object,
      default: () => {}
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['pendingDownloadList']),
    checked () {
      return new Set(this.pendingDownloadList).has(this.wallpaper.downloadUrl)
    }
  },
  methods: {
    pickThis (val) {
      if (!this.checked) {
        this.$store.commit('ADD_TO_SELECTED', val.downloadUrl)
      } else {
        this.$store.commit('DELETE_FROM_SELECTED', val.downloadUrl)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wallpaper {
  position: relative;
  margin-bottom: 15px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  img {
    width: 105%;
    transform: translateY(-6%) translateX(-2.5%);
    clip-path: inset(10% 5%);
  }
  &-title {
    margin: 0;
    position: absolute;
    bottom: 0;
    padding: 2%;
    color: #909399;
    font-weight: normal;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #DCDFE6;
  }
  &-selector {
    position: absolute;
    top: -40px;
    left: -40px;
    width: 80px;
    height: 80px;
    background: #409EFF;
    transform: rotate(45deg);
    i {
      position: absolute;
      bottom: 30px;
      right: 1px;
      font-size: 24px;
      transform: rotate(-45deg);
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
