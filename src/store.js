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
    currentPageSrc: BASE_URL,
    webviewSrc: BASE_URL,
    preloadWallpapers: [],
    loading: false,
    pageTotal: 0
  },
  mutations: {
    INIT_CATEGORY (_state, categories) {
      _state.loadedCategories = categories
      if (categories[BASE_URL]) {
        _state.onShowWallpapers = categories[BASE_URL].wallpapers
        _state.pageTotal = Number(categories[BASE_URL].wallpapers[0].total)
        _state.loadedWallpapers = _state.loadedWallpapers.concat(_state.onShowWallpapers)
      }
    },
    UPDATE_PAGE_TOTAL (_state, total) {
      _state.pageTotal = total
    },
    SET_LOADING (_state, val) {
      _state.loading = val
    },
    LOAD_CATEGORY (_state, { src, cate }) {
      Vue.set(_state.loadedCategories, src, cate)
      _state.onShowWallpapers = cate.wallpapers
      _state.loadedWallpapers = _state.loadedWallpapers.concat(cate.wallpapers)
    },
    UPDATE_WEBVIEW_SRC (_state, src) {
      if (!_state.loadedCategories[src]) {
        _state.webviewSrc = src
      } else {
        _state.onShowWallpapers = _state.loadedCategories[src].wallpapers
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
    PRELOAD_CATE (_state, { src, cate }) {
      Vue.set(_state.loadedCategories, src, cate)
      _state.loadedWallpapers = _state.loadedWallpapers.concat(cate.wallpapers)
    }
  },
  actions: {
    async initCache ({ commit }) {
      const loadedCategories = await loadCache()
      commit('INIT_CATEGORY', loadedCategories)
      return loadedCategories
    },
    async loadCategory ({ commit }, { src, cate }) {
      await updateCache(src, cate)
      commit('LOAD_CATEGORY', { src, cate })
      if (cate.wallpapers[0].total) {
        commit('UPDATE_PAGE_TOTAL', Number(cate.wallpapers[0].total))
      }
    },
    async preloadCate ({ commit }, { src, cate }) {
      await updateCache(src, cate)
      commit('PRELOAD_CATE', { src, cate })
    },
    async clearCache () {
      await DB.remove({}, { multi: true })
    }
  },
  getters: {
    allPreloadWallpapers (_state) {
      const allloadedWallpapers = [].concat(...Object.keys(_state.loadedCategories).map(key => _state.loadedCategories[key].wallpapers))
      return allloadedWallpapers.filter(({ downloadUrl }) => _state.preloadWallpapers.includes(downloadUrl))
    }
  }
})
