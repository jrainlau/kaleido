<template>
  <div class="load-wallpaper">
    <el-progress
      class="load-wallpaper-progress"
      v-show="showProgress"
      :percentage="progress"
      :show-text="false"></el-progress>
    <webview id="webview" ref="webview" :src="webviewSrc" style="display:none;" nodeintegration disablewebsecurity></webview>
  </div>
</template>

<script>
import { mapState } from 'vuex'

function random (n, m) {
  var c = m - n + 1
  return Math.floor(Math.random() * c + n)
}

export default {
  data () {
    return {
      progress: 0,
      showProgress: false
    }
  },
  computed: {
    ...mapState(['webviewSrc'])
  },
  mounted () {
    const webview = this.$refs['webview']
    webview.addEventListener('load-commit', () => {
      this.showProgress = true
      console.log(`Start loading ${this.webviewSrc}...`)
    })
    webview.addEventListener('did-start-loading', () => {
      this.progress = random(5, 30)
    })
    webview.addEventListener('did-finish-load', () => {
      this.progress = 100
      console.log('Loading finished!')
      setTimeout(() => {
        this.showProgress = false
      }, 1000)
    })
    webview.addEventListener('dom-ready', () => {
      webview.getWebContents().executeJavaScript(`
        var paginationArr = document.querySelectorAll('.pagination')
        var paginations = paginationArr[paginationArr.length -1].children
        var pageAmount = paginations[paginations.length - 2].text
        var screenResolution = document.querySelector('#header > div.screen-res > span:nth-child(4) > strong').textContent.replace(/\\s+/g, '')
        var wallpaperNodeList = document.querySelectorAll('.wallpapers')
        var currentList = wallpaperNodeList[wallpaperNodeList.length - 1]
        var wallpapers = Array.from(currentList.querySelectorAll('img')).map(img => {
          var imgName = img.src.replace(/http:\\/\\/hd\\.wallpaperswide\\.com\\/thumbs\\/|\\-t1\\.jpg/g, '')
          return {
            thumb: img.src,
            name: imgName,
            downloadUrl: 'http://wallpaperswide.com/download/' + imgName + '-wallpaper-' + screenResolution + '.jpg',
            total: pageAmount
          }
        })

        ;(() => {
          return {
            wallpapers: wallpapers
          }
        })()
      `, false, (res) => {
        this.$store.commit('LOAD_CATEGORY', {
          src: this.webviewSrc,
          cate: res
        })
      })
    })
  }
}
</script>

<style lang="less">
.load-wallpaper {
  width: 100%;
  position: absolute;
  z-index: 1000;
  &-progress {
    border-radius: 0;
    div {
      border-radius: 0;
    }
  }
}
</style>
