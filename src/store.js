import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'

Vue.use(Vuex)

async function loadCache () {
  const rawData = (await DB.find({}))[0] || {}
  const loadedUrls = {}
  Object.keys(rawData).forEach(key => {
    if (key === '_id') return
    loadedUrls[key.replace('@', '.')] = rawData[key]
  })
  return loadedUrls
}

async function initCache () {
  const database = (await DB.find({}))[0] || await DB.insert({})
  return database._id
}

async function updateCache (src, cate) {
  const dbId = await initCache()
  const setData = {}
  setData[src.replace('.', '@')] = cate
  DB.update({
    _id: dbId
  }, {
    $set: setData
  })
}

const BASE_URL = 'http://wallpaperswide.com/page/1'

export default new Vuex.Store({
  state: {
    loadedUrls: {},
    onShowWallpapers: [],
    loadedWallpapers: [],
    currentPageSrc: BASE_URL,
    webviewSrc: BASE_URL,
    preloadWallpapers: [],
    loading: false,
    pageTotal: 0
  },
  mutations: {
    INIT_LOADED_URLS (_state, loadedUrls) {
      _state.loadedUrls = loadedUrls
      if (loadedUrls[BASE_URL]) {
        _state.onShowWallpapers = loadedUrls[BASE_URL].wallpapers
        _state.pageTotal = Number(loadedUrls[BASE_URL].wallpapers[0].total)
        _state.loadedWallpapers = _state.loadedWallpapers.concat(_state.onShowWallpapers)
      }
    },
    UPDATE_PAGE_TOTAL (_state, total) {
      _state.pageTotal = total
    },
    SET_LOADING (_state, val) {
      _state.loading = val
    },
    LOAD_URL (_state, { src, cate }) {
      Vue.set(_state.loadedUrls, src, cate)
      _state.onShowWallpapers = cate.wallpapers
      _state.loadedWallpapers = _state.loadedWallpapers.concat(cate.wallpapers)
    },
    UPDATE_WEBVIEW_SRC (_state, src) {
      if (!_state.loadedUrls[src]) {
        _state.webviewSrc = src
      } else {
        _state.onShowWallpapers = _state.loadedUrls[src].wallpapers
      }
      _state.currentPageSrc = src
    },
    ADD_TO_SELECTED (_state, url) {
      _state.preloadWallpapers.push(url)
    },
    DELETE_FROM_SELECTED (_state, url) {
      const preloadSet = new Set(_state.preloadWallpapers)
      preloadSet.delete(url)
      _state.preloadWallpapers = [...preloadSet]
    },
    CLEAR_PRELOAD_WALLPAPERS (_state) {
      _state.preloadWallpapers = []
    },
    PRELOAD_URL (_state, { src, cate }) {
      Vue.set(_state.loadedUrls, src, cate)
      _state.loadedWallpapers = _state.loadedWallpapers.concat(cate.wallpapers)
    }
  },
  actions: {
    async initCache ({ commit }) {
      const loadedUrls = await loadCache()
      commit('INIT_LOADED_URLS', loadedUrls)
      return loadedUrls
    },
    async loadUrl ({ commit }, { src, cate }) {
      await updateCache(src, cate)
      commit('LOAD_URL', { src, cate })
      if (cate.wallpapers[0].total) {
        commit('UPDATE_PAGE_TOTAL', Number(cate.wallpapers[0].total))
      }
    },
    async preloadUrl ({ commit }, { src, cate }) {
      await updateCache(src, cate)
      commit('PRELOAD_URL', { src, cate })
    },
    async clearCache () {
      await DB.remove({}, { multi: true })
    }
  },
  getters: {
    allPreloadWallpapers (_state) {
      const allloadedWallpapers = [].concat(...Object.keys(_state.loadedUrls).map(key => _state.loadedUrls[key].wallpapers))
      return allloadedWallpapers.filter(({ downloadUrl }) => _state.preloadWallpapers.includes(downloadUrl))
    }
  }
})
