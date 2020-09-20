<script>
import Vue from 'vue'
const userInfo = {}

function errorTip (error) {
  Vue.prototype.$message.error(error.msg)
}

export default {
  name: 'global',
  userInfo,
  errorTip
}
</script>

<style scoped>

</style>
