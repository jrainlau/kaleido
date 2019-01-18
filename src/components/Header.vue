<template>
  <div class="header">
    <div class="header-logo" @click="toMain">
      <img :src="require('@/assets/imgs/logo.png')" alt="">
    </div>
    <div class="header-tools">
      <a class="header-github" href="javascript:void(0)" title="Github" @click="toGithub">
        <img :src="require('@/assets/imgs/github.png')" alt="">
      </a>
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
const { ipcRenderer, shell } = window.require('electron')

export default {
  components: {
    Selector
  },
  computed: {
    ...mapState(['preloadWallpapers'])
  },
  methods: {
    download () {
      this.$store.commit('SET_LOADING', true)
      dialog.showSaveDialog({
        defaultPath: 'kaleido_wallpapers'
      }, (dirPath) => {
        if (!dirPath) return
        const res = ipcRenderer.sendSync('start-download', {
          wallpapers: this.preloadWallpapers,
          dirPath
        })
        if (res) {
          this.$store.commit('CLEAR_PRELOAD_WALLPAPERS')
          dialog.showMessageBox({
            title: 'Success!',
            message: res,
            detail: `All the wallpapers have been saved in path \n"${dirPath}"`,
            buttons: ['OK']
          })
          this.$store.commit('SET_LOADING', false)
          this.$router.push('/')
        }
      })
    },
    toPreload () {
      this.$router.push('/preload')
    },
    toMain () {
      this.$router.push('/')
      this.$store.commit('UPDATE_WEBVIEW_SRC', 'http://wallpaperswide.com/page/1')
    },
    toGithub () {
      shell.openExternal('https://github.com/jrainlau/kaleido')
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
    cursor: pointer;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
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
  &-github {
    width: 25px;
    height: 25px;
    margin-left: 15px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
