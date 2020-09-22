<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>所有课程</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-checkbox v-model="myChosenChecked" @change="query">我选的</el-checkbox>
      <el-checkbox v-model="myCreatedChecked" @change="query">我教的</el-checkbox>
      <el-checkbox v-model="myTaughtChecked" @change="query">我创建的</el-checkbox>
      <el-form :inline="true" :model="courseForm" class="demo-form-inline"  v-if="state.userInfo.roleId==3">
        <el-form-item>
          <el-input v-model="courseForm.subtitle" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker type="date" placeholder="选择开始日期" v-model="courseForm.startTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker type="date" placeholder="选择结束日期" v-model="courseForm.endTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="courseForm.teacherNames" placeholder="教师"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>
      <paginate-table :data-list="courseTable" :pagination="pagination" :page-change="changePage">
      </paginate-table>
      <el-table
        width=”100%“
        :data="courseTable"
        border
        :header-cell-style="[{height: '20px'}]"
      >
        <el-table-column prop="id" label="课程号"></el-table-column>
        <el-table-column prop="subjectName" label="课程名"></el-table-column>
        <el-table-column prop="subtitle" label="课程标题"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="teacherNames" label="任课教师" :formatter="typeFormatter"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId==3" align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId==2 && myChosenChecked==true"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="courseQuit(scope.row)">退课</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId==2 && myChosenChecked==false"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="coursePick(scope.row)">选课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import getCourse from '../api/course/getCourse'
import { errorTip } from '../utils/tips'
import { forDate } from '../utils/time'

import store from '../store'
export default {
  created () {
    this.query()
    this.$axios.get('api/v1/courses')
      .then((data) => {
        this.courseTable = data.results
      })
  },
  data () {
    return {
      state: store.state,
      pagination: {},
      myChosenChecked: false,
      myCreatedChecked: false,
      myTaughtChecked: false,
      courseTable: [
        {
          endTime: '',
          id: '',
          startTime: '',
          subjectName: '',
          subtitle: '',
          teacherNames: []
        }
      ],
      courseForm: [
        {
          endTime: '2020-09-22T03:19:16.708Z',
          startTime: '2020-09-22T03:19:16.708Z',
          subjectId: 0,
          subtitle: 'test',
          teacherIds: []
        }
      ]
    }
  },
  methods: {
    changePage (pageNum) {
      const params = getCourse.initParams()
      params.personal = this.myCreate
      params.pageNum = pageNum
      getCourse.request(params)
        .then(resp => {
          this.courseTable = resp.results
          this.pagination = resp.pagination
        })
        .catch(errorTip)
    },
    handleDelete (index, row) {
      this.$axios.delete('api/v1/teacher/courses/' + row.id)
        .then((data) => {
          this.$message.success('成功删除')
        })
        .catch(errorTip)
      this.query()
    },
    coursePick (row) {
      this.$axios.post('api/v1/student/courses?courseId=' + row.id)
        .then((data) => {
          this.$message.success('选课成功')
        })
        .catch(errorTip)
      this.query()
    },
    courseQuit (row) {
      console.log(row)
      this.$axios.delete('api/v1/student/courses?courseId=' + row.id)
        .then((data) => {
          this.$message.success('退课成功')
        })
        .catch(errorTip)
      this.query()
    },
    query () {
      const params = getCourse.initParams()
      params.myChosen = this.myChosenChecked
      params.myCreated = this.myCreatedChecked
      params.myTaught = this.myTaughtChecked
      getCourse.request(params)
        .then((data) => {
          this.courseTable = data.results
        })
        .catch(errorTip)
    },
    typeFormatter: function (row, column) {
      return row.teacherNames.join(',')
    },
    dateFormatter: function (row, column, cellValue, index) {
      return forDate(cellValue)
    },
    onSubmit () { // 失败
      this.$axios.post('api/v1/teacher/courses', this.courseForm)
        .then(data => {
          console.log(data)
        })
        .catch(errorTip)
      this.query()
    }
  }
}
</script>
<style type="less" scoped>
  .teacher-operation{
    display: none;
  }
</style>
