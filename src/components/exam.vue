<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <paginate-table :data-list="examList" :pagination="pagination">
        <el-table-column prop="subjectName" label="科目名称"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFormatter"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFormatter"></el-table-column>
        <el-table-column prop="paperTitle" label="试卷标题"></el-table-column>
      </paginate-table>
    </el-card>
  </div>
</template>

<script>
// import { errorTip } from '../utils/tips'
import { dateTimeFormatter } from '../utils/time'
import PaginateTable from './PaginateTable'
import store from '../store'

export default {
  name: 'examPlan',
  components: { PaginateTable },
  data () {
    return {
      state: store.state,
      pagination: {},
      dateTimeFormatter: dateTimeFormatter,
      examList: []
    }
  },
  methods: {
    getExamList () {
    }
  },
  created () {
    this.getExamList()
  }
}
</script>

<style lang="less" scoped>
</style>
