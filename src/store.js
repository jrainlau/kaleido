import Vue from 'vue'
import Vuex from 'vuex'
import DB from './database'

Vue.use(Vuex)

async function loadCache () {
  const rawData = (await DB.find({}))[0] || {}
  const loadedCategories = {}
  Object.keys(rawData).forEach(key => {
    if (key === '_id') return
    loadedCategories[key.replace('@', '.')] = rawData[key]
  })
  return loadedCategories
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
    loadedCategories: {},
    onShowWallpapers: [],
    loadedWallpapers: [],
    loadedUrls: new Set(),
    currentPageAmount: 0,
    currentWebviewSrc: BASE_URL,
    webviewSrc: BASE_URL,
    selectedWallpapers: [],
    preloadWallpapers: [],
    loading: false
  },
  mutations: {
    INIT_CATEGORY (_state, categories) {
      _state.loadedCategories = categories
      if (categories[BASE_URL]) {
        _state.onShowWallpapers = categories[BASE_URL].wallpapers
        _state.loadedWallpapers = _state.loadedWallpapers.concat(_state.onShowWallpapers)
      }
    },
    SET_LOADING (_state, val) {
      _state.loading = val
    },
    LOAD_CATEGORY (_state, { src, cate }) {
      _state.loadedCategories[src] = cate
      _state.onShowWallpapers = cate.wallpapers
      _state.loadedWallpapers = _state.loadedWallpapers.concat(cate.wallpapers)
    },
    UPDATE_WEBVIEW_SRC (_state, src) {
      if (!_state.loadedCategories[src]) {
        _state.webviewSrc = src
      } else {
        _state.onShowWallpapers = _state.loadedCategories[src].wallpapers
      }
      _state.currentWebviewSrc = src
    },
    ADD_TO_SELECTED (_state, url) {
      _state.selectedWallpapers.push(url)
      _state.preloadWallpapers.push(url)
    },
    DELETE_FROM_SELECTED (_state, url) {
      const selectedSet = new Set(_state.selectedWallpapers)
      selectedSet.delete(url)
      _state.selectedWallpapers = [...selectedSet]

      const preloadSet = new Set(_state.preloadWallpapers)
      preloadSet.delete(url)
      _state.preloadWallpapers = [...preloadSet]
    },
    SELECT_ALL_ON_SHOW_WALLPAPERS (_state) {
      _state.selectedWallpapers = _state.onShowWallpapers.map(({ downloadUrl }) => downloadUrl)
      _state.preloadWallpapers = _state.preloadWallpapers.concat(_state.selectedWallpapers)
    },
    DELETE_ALL_SELECTED_ON_SHOW_WALLPAPERS (_state) {
      const preloadSet = new Set(_state.preloadWallpapers)
      _state.selectedWallpapers.forEach(url => {
        preloadSet.delete(url)
      })
      _state.selectedWallpapers = []
      _state.preloadWallpapers = [...preloadSet]
    },
    RESET_SELECTED_ON_SHOW_WALLPAPERS (_state) {
      _state.selectedWallpapers = []
    },
    CLEAR_PRELOAD_WALLPAPERS (_state) {
      _state.preloadWallpapers = []
    }
  },
  actions: {
    async initCache ({ commit }) {
      const loadedCategories = await loadCache()
      commit('INIT_CATEGORY', loadedCategories)
      return loadedCategories
    },
    async locadCache ({ commit }, { src, cate }) {
      await updateCache(src, cate)
      commit('LOAD_CATEGORY', { src, cate })
    },
    async clearCache () {
      await DB.remove({}, { multi: true })
    }
  },
  getters: {
    allloadedWallpapers (_state) {
      return [].concat(...Object.keys(_state.loadedCategories).map(key => _state.loadedCategories[key].wallpapers))
    },
    allPreloadWallpapers (_state) {
      const allloadedWallpapers = [].concat(...Object.keys(_state.loadedCategories).map(key => _state.loadedCategories[key].wallpapers))
      return allloadedWallpapers.filter(({ downloadUrl }) => _state.preloadWallpapers.includes(downloadUrl))
    },
    onShowSelectedWallpapers (_state) {
      const preloadWallpapers = _state.preloadWallpapers
      const onShowWallpapers = _state.onShowWallpapers
      return onShowWallpapers
        .filter(({ downloadUrl }) => preloadWallpapers.includes(downloadUrl))
        .map(({ downloadUrl }) => downloadUrl)
    }
  }
})
