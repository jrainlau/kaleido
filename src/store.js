import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedCate: {},
    currentList: [],
    currentPageAmount: 0,
    currentWebviewSrc: 'http://wallpaperswide.com/page/1',
    loadedList: [],
    loadedUrl: new Set(),
    webviewSrc: 'http://wallpaperswide.com/page/1',
    selectedWallpapers: []
  },
  mutations: {
    LOAD_CATEGORY (_state, { src, cate }) {
      _state.loadedCate[src] = cate
      _state.currentList = cate.wallpapers
      _state.loadedList = _state.loadedList.concat(cate.wallpapers)
    },
    UPDATE_WEBVIEW_SRC (_state, src) {
      if (!_state.loadedCate[src]) {
        _state.webviewSrc = src
      } else {
        _state.currentList = _state.loadedCate[src].wallpapers
      }
      _state.currentWebviewSrc = src
    },
    ADD_TO_SELECTED (_state, url) {
      _state.selectedWallpapers.push(url)
    },
    DELETE_FROM_SELECTED (_state, url) {
      const selectedSet = new Set(_state.selectedWallpapers)
      selectedSet.delete(url)
      _state.selectedWallpapers = [...selectedSet]
    },
    SELECT_ALL (_state) {
      _state.selectedWallpapers = _state.currentList.map(({ downloadUrl }) => downloadUrl)
    },
    DELETE_ALL (_state) {
      _state.selectedWallpapers = []
    }
  },
  actions: {

  }
})
