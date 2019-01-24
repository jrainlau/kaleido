<template>
  <div class="resolutions">
    <el-cascader
      size="small"
      placeholder="Resolutions"
      :options="resolutions"
      filterable
      @change="onChange"
    ></el-cascader>
  </div>
</template>

<script>
import resolutions from '../assets/resolutions.js'

const BASE_DOMAIN = 'http://wallpaperswide.com'

export default {
  data () {
    return {
      resolutions
    }
  },
  methods: {
    onChange ([desc, value]) {
      console.log(desc)
      const newSrc = `${BASE_DOMAIN}/${value}-wallpapers-r/page/1`
      this.$store.commit('UPDATE_WEBVIEW_SRC', newSrc)
    }
  }
}
</script>
