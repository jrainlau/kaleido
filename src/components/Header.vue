<template>
  <div class="header">
    <h1 class="header-logo" @click="toMain">Kaleido</h1>
    <div class="header-tools">
      <el-button :disabled="!preloadWallpapers.length" size="mini" type="primary" round @click="download">
        Download
      </el-button>
      <el-badge class="header-tools-selected" :hidden="!preloadWallpapers.length" :value="preloadWallpapers.length">
        <el-button :disabled="!preloadWallpapers.length" size="mini" type="plain" round @click="toPreload">
          Selected
        </el-button>
      </el-badge>
      <Selector v-if="$route.path === '/'" name="All" />
    </div>
  </div>
</template>

<script>
import Selector from './Selector'
import { mapState } from 'vuex'
const { dialog } = window.require('electron').remote
const { ipcRenderer } = window.require('electron')

export default {
  components: {
    Selector
  },
  computed: {
    ...mapState(['preloadWallpapers'])
  },
  methods: {
    download () {
      dialog.showSaveDialog({
        defaultPath: 'kaleido_wallpapers'
      }, (dirPath) => {
        if (!dirPath) return
        const res = ipcRenderer.sendSync('start-download', {
          wallpapers: this.preloadWallpapers,
          dirPath
        })
        if (res) {
          dialog.showMessageBox({
            message: res,
            buttons: ['OK']
          })
        }
      })
    },
    toPreload () {
      this.$router.push('/preload')
    },
    toMain () {
      this.$router.push('/')
      this.$store.commit('UPDATE_WEBVIEW_SRC', 'http://wallpaperswide.com/page/1')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  z-index: 100;
  &-logo {
    width: 240px;
    margin: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    box-sizing: border-box;
  }
  &-tools {
    padding: 0 10px;
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    &-selected {
      margin-right: 15px;
    }
  }
}
</style>
