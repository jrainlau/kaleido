import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    onloadCategories: {},
    onshowWallpapers: [],
    onloadWallpapers: [],
    onloadUrls: new Set(),
    currentPageAmount: 0,
    currentWebviewSrc: 'http://wallpaperswide.com/page/1',
    webviewSrc: 'http://wallpaperswide.com/page/1',
    selectedWallpapers: [],
    preloadWallpapers: []
  },
  mutations: {
    LOAD_CATEGORY (_state, { src, cate }) {
      _state.onloadCategories[src] = cate
      _state.onshowWallpapers = cate.wallpapers
      _state.onloadWallpapers = _state.onloadWallpapers.concat(cate.wallpapers)
    },
    UPDATE_WEBVIEW_SRC (_state, src) {
      if (!_state.onloadCategories[src]) {
        _state.webviewSrc = src
      } else {
        _state.onshowWallpapers = _state.onloadCategories[src].wallpapers
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
      _state.selectedWallpapers = _state.onshowWallpapers.map(({ downloadUrl }) => downloadUrl)
      _state.preloadWallpapers = _state.onshowWallpapers.map(({ downloadUrl }) => downloadUrl)
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
    }
  },
  getters: {
    allOnloadWallpapers (_state) {
      return [].concat(...Object.keys(_state.onloadCategories).map(key => _state.onloadCategories[key].wallpapers))
    },
    allPreloadWallpapers (_state) {
      const allOnloadWallpapers = [].concat(...Object.keys(_state.onloadCategories).map(key => _state.onloadCategories[key].wallpapers))
      return allOnloadWallpapers.filter(({ downloadUrl }) => _state.preloadWallpapers.includes(downloadUrl))
    }
  }
})
