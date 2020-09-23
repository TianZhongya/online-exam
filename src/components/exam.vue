<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
      width=”100%“
      :data="tableData"
      border
      :header-cell-style="{height: '20px'}"
      >
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="subject"
          label="科目">
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <el-button>进入考试</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'exam',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        subject: '考啥试',
        start_time: '21:30',
        end_time: '22:30'
      },
      {
        date: '2016-05-02',
        subject: '啥考试',
        start_time: '21:30',
        end_time: '22:30'
      },
      {
        date: '2016-05-02',
        subject: '考试啥',
        start_time: '21:30',
        end_time: '22:30'
      }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
