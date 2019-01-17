<template>
  <div class="home">
    <webview id="wv1" :src="webviewSrc" style="display:none;" nodeintegration disablewebsecurity></webview>
    <button @click="changeCate">Change</button>
    <ul>
      <li v-for="(wallpaper, i) in wallpapers" :key="i">
        <img :src="wallpaper.thumb" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
// const ipcRenderer = window.require('electron').ipcRenderer

export default {
  name: 'home',
  data () {
    return {
      wallpapers: [],
      webviewSrc: 'http://wallpaperswide.com/'
    }
  },
  methods: {
    changeCate () {
      this.webviewSrc = 'http://wallpaperswide.com/animals-desktop-wallpapers.html'
    }
  },
  mounted () {
    // ipcRenderer.on('getWallpaper', (event, arg) => {
    //   console.log(arg)
    // })
    // ipcRenderer.send('selectCategory', {
    //   category: 'Areo',
    //   pagination: 1
    // })

    const webview = document.getElementById('wv1')
    webview.addEventListener('dom-ready', () => {
      console.log('xxx')
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
            downloadUrl: 'http://wallpaperswide.com/download/' + imgName + '-wallpaper-' + screenResolution + '.jpg'
          }
        })

        ;(() => {
          return {
            pageAmount: pageAmount,
            wallpapers: wallpapers
          }
        })()
      `, false, (res) => {
        console.log(res)
        this.wallpapers = res.wallpapers
      })
    })
  }
}
</script>
