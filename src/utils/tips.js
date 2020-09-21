import Vue from 'vue'

export const errorTip = function (error) {
  Vue.prototype.$message.error(error.message)
}

export default {
  errorTip
}
