<template>
  <div class="load-wallpaper">
    <el-progress
      class="load-wallpaper-progress"
      v-show="showProgress"
      :percentage="progress"
      :show-text="false"></el-progress>
    <webview v-if="initWebview" ref="webview" :src="webviewSrc" style="display:none;" nodeintegration disablewebsecurity></webview>
    <webview ref="preload" :src="preloadSrc" style="display:none;" nodeintegration disablewebsecurity></webview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import inject from '@/assets/inject.js'

let preloadLock = false

function random (n, m) {
  var c = m - n + 1
  return Math.floor(Math.random() * c + n)
}

export default {
  data () {
    return {
      progress: 0,
      showProgress: false,
      initWebview: false,
      preloadSrc: '',
      preloadQueue: []
    }
  },
  computed: {
    ...mapState(['webviewSrc', 'currentPageSrc', 'loadedUrls', 'onShowWallpapers'])
  },
  watch: {
    webviewSrc (val) {
      if (!this.initWebview) {
        this.initWebview = true
        this.$nextTick(this.loadWebview)
      }
    },
    currentPageSrc (val) {
      const pageCount = val.match(/\d+$/g)[0]
      const preloadSrc = val.replace(/page\/\d+/g, `page/${Number(pageCount) + 1}`)
      if (!this.loadedUrls[preloadSrc] && Number(pageCount) <= Number(this.onShowWallpapers[0].total)) {
        this.preloadQueue.push(preloadSrc)
      }
      this.$nextTick(this.preloadWebview)
    }
  },
  async mounted () {
    const loadedUrls = await this.$store.dispatch('initCache')
    if (!Object.keys(loadedUrls).length) {
      this.initWebview = true
      this.$nextTick(this.loadWebview)
    }
    const TEMP_PRELOAD_URL = 'http://wallpaperswide.com/page/2'
    if (!loadedUrls[TEMP_PRELOAD_URL]) {
      this.preloadQueue.push(TEMP_PRELOAD_URL)
      this.$nextTick(this.preloadWebview)
    }
  },
  methods: {
    loadWebview () {
      const webview = this.$refs['webview']
      webview.addEventListener('load-commit', () => {
        this.showProgress = true
        if (this.progress < 70) {
          this.progress += random(10, 30)
        }
        console.log(`Start loading ${this.webviewSrc}...`)
      })
      webview.addEventListener('did-start-loading', () => {
        this.progress = 0
        this.$store.commit('SET_LOADING', true)
      })
      webview.addEventListener('did-fail-load', () => {
        this.$msgbox({
          title: 'Loading failed',
          message: 'Please check out your network or restart the app.',
          type: 'error',
          confirmButtonText: 'Reload'
        }).then(() => {
          location.reload()
        })
      })
      webview.addEventListener('did-finish-load', () => {
        this.progress = 100
        console.log('Loading finished!')
        setTimeout(() => {
          this.showProgress = false
          this.$store.commit('SET_LOADING', false)
        }, 1000)
      })
      webview.addEventListener('dom-ready', () => {
        webview.getWebContents().executeJavaScript(inject, false, (res) => {
          this.$store.dispatch('loadUrl', {
            src: this.webviewSrc,
            cate: res
          })
        })
      })
    },
    preloadWebview () {
      if (this.preloadQueue.length > 0 && !preloadLock) {
        preloadLock = true
        this.preloadSrc = this.preloadQueue.shift()
        const webview = this.$refs['preload']
        webview.addEventListener('load-commit', () => {
          console.log(`Preloading ${this.preloadSrc}...`)
        })
        webview.addEventListener('did-fail-load', () => {
          console.error('Preload failed')
        })
        webview.addEventListener('dom-ready', () => {
          webview.getWebContents().executeJavaScript(inject, false, (res) => {
            console.log('Preload finished!')
            preloadLock = false
            this.$store.dispatch('preloadUrl', {
              src: this.preloadSrc,
              cate: res
            })
            this.$nextTick(this.preloadWebview)
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.load-wallpaper {
  width: 100%;
  position: absolute;
  z-index: 3000;
  &-progress {
    border-radius: 0;
    div {
      border-radius: 0;
    }
  }
}
</style>
