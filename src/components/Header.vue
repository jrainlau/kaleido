<template>
  <div class="header">
    <div class="header-logo" @click="toMain">
      <img :src="require('@/assets/imgs/logo.png')" alt="">
    </div>
    <div class="header-tools">
      <a class="header-tools-github" href="javascript:void(0)" title="Github" @click="toGithub">
        <img :src="require('@/assets/imgs/github.png')" alt="">
      </a>
      <el-button :disabled="!pendingDownloadList.length" size="mini" type="primary" round @click="download">
        Download
      </el-button>
      <el-badge class="header-tools-selected" :hidden="!pendingDownloadList.length" :value="pendingDownloadList.length">
        <el-button :disabled="!pendingDownloadList.length" size="mini" type="plain" round @click="toPreload">
          Selected
        </el-button>
      </el-badge>
      <i v-if="$route.path === '/'" title="refresh" class="header-tools-refresh el-icon-refresh" @click="refresh"></i>
      <i v-if="$route.path !== '/'" title="delete all" class="header-tools-delete el-icon-delete" @click="deleteAll"></i>

      <el-badge class="header-tools-update" :is-dot="!versionMatch">
        <el-tooltip :disabled="versionMatch" :content="`A new version of v ${latestVersion} is available, click to update.`" placement="bottom">
          <span @click="updateVersion" :style="versionMatch ? `cursor: default;` : `cursor: pointer`">v {{currentVersion}}</span>
        </el-tooltip>
      </el-badge>

      <el-popover
        placement="bottom"
        width="280"
        trigger="manual"
        v-model="showUpdatePanel">
        <div class="header-tools-proccessing">
          <p v-for="(msg, i) in updatingMsgs" :key="i">{{msg}}</p>
          <el-button v-if="showRelaunchBtn" type="primary" icon="el-icon-check" size="mini" @click="relaunch">Relaunch</el-button>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const { dialog } = window.require('electron').remote
const { ipcRenderer, shell } = window.require('electron')

export default {
  data () {
    return {
      versionMatch: true,
      currentVersion: '',
      latestVersion: '',
      showUpdatePanel: false,
      showRelaunchBtn: false,
      updatingMsgs: []
    }
  },
  computed: {
    ...mapState(['pendingDownloadList'])
  },
  mounted () {
    ipcRenderer.on('updating', (event, args) => {
      console.log(args)
      this.updatingMsgs.push(args)
    })
    ipcRenderer.on('update-result', (event, args) => {
      console.log(args)
      if (args.update === 'successed') {
        this.showRelaunchBtn = true
      }
    })
    const res = ipcRenderer.sendSync('check-update')
    this.versionMatch = res.match
    this.currentVersion = res.currentVersion
    this.latestVersion = res.latestVersion
  },
  methods: {
    download () {
      this.$store.commit('SET_LOADING', true)
      dialog.showSaveDialog({
        defaultPath: 'kaleido_wallpapers'
      }, (dirPath) => {
        if (!dirPath) {
          this.$store.commit('SET_LOADING', false)
          return
        }
        const res = ipcRenderer.sendSync('start-download', {
          wallpapers: this.pendingDownloadList,
          dirPath
        })
        if (res) {
          this.$store.commit('CLEAR_PRELOAD_WALLPAPERS')
          this.$message({
            message: 'Download completed!',
            type: 'success'
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
    },
    refresh () {
      this.$confirm('Kaleido caches the visited data in order to speedup your next visitation, but this operation will clear all the cache. Are you sure to go on?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('clearCache')
        this.$message({
          type: 'success',
          message: 'Reloading page...'
        })
        setTimeout(() => {
          location.reload()
        }, 2000)
      }).catch(() => {})
    },
    deleteAll () {
      this.$confirm('Delete all selected wallpaper?', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then(() => {
        this.$store.commit('CLEAR_PRELOAD_WALLPAPERS')
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      }).catch(() => {})
    },
    updateVersion () {
      if (!this.versionMatch) {
        this.showUpdatePanel = true
        ipcRenderer.send('update-version')
      }
    },
    relaunch () {
      this.showUpdatePanel = false
      this.showRelaunchBtn = false
      this.updatingMsgs = []
      ipcRenderer.send('relaunch')
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
    position: relative;
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
      margin: 0 5px;
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
    &-refresh {
      color: #606266;
      font-size: 20px;
    }
    &-delete {
      color: #606266;
      font-size: 20px;
    }
    &-update {
      margin: 0 15px;
      outline: none;
      span {
        font-size: 12px;
        color: #909399;
      }
    }
    &-proccessing {
      p {
        font-style: italic;
      }
    }
  }
}
</style>
