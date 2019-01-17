<template>
  <div class="resolutions">
    <el-cascader
      size="small"
      placeholder="Resolutions"
      :options="resolutions"
      filterable
    ></el-cascader>
  </div>
</template>

<script>
import resolutions from '../assets/resolutions.js'

export default {
  data () {
    return {
      resolutions
    }
  }
}
</script>
