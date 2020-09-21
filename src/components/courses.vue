<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>所有课程</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-col :span="7">
        <el-input
          placeholder="请输入内容"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
      <el-table
        width=”100%“
        :data="courseTable"
        border
        :header-cell-style="[{height: '20px'}]"
      >
        <el-table-column
          prop="id"
          label="课程号">
        </el-table-column>
        <el-table-column
          prop="subjectName"
          label="课程名">
        </el-table-column>
        <el-table-column
          prop="subtitle"
          label="课程标题">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="teacherNames"
          label="任课教师">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.$axios.get('api/v1/courses')
      .then((data) => {
        console.log(data)
        this.courseTable = data.results
      })
  },
  data () {
    return {
      courseTable: [
        {
          endTime: '',
          id: '',
          startTime: '',
          subjectName: '',
          subtitle: '',
          teacherNames: []
        }
      ]
    }
  },
  methods: {
  }
}
</script>
<style type="less" scoped> </style>
