<template>
  <el-radio-group :value="value" v-model="type" @change="$emit('input', type);$emit('change', value)">
    <slot></slot>
    <el-radio :label="1">单选</el-radio>
    <el-radio :label="2">多选</el-radio>
    <el-radio :label="3">判断</el-radio>
    <el-radio :label="5">简答</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'QuestionTypeSelector',
  props: ['value'],
  data () {
    return {
      type: 1
    }
  }
}
</script>

<style scoped>

</style>
