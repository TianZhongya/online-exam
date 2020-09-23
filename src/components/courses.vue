<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>所有课程</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-checkbox v-model="myChosenChecked" @change="query" v-if="state.userInfo.roleId===2">我选的</el-checkbox>
          <el-checkbox v-model="myCreatedChecked" @change="query" v-if="state.userInfo.roleId===3">我创建的</el-checkbox>
          <el-checkbox v-model="myTaughtChecked" @change="query" v-if="state.userInfo.roleId===3">我教的</el-checkbox>
        </el-col>
        <el-col :span="1" :offset="24-6-1">
          <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle
                     v-if="state.userInfo.roleId===3"></el-button>
        </el-col>
      </el-row>
      <paginate-table :data-list="courseTable" :pagination="pagination" :page-change="changePage">
        <el-table-column prop="id" label="课程号"></el-table-column>
        <el-table-column prop="subjectName" label="课程名"></el-table-column>
        <el-table-column prop="subtitle" label="课程标题"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="teacherNames" label="任课教师" :formatter="typeFormatter"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId===3" align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2 && myChosenChecked===true"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="courseQuit(scope.row)">退课
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2 && myChosenChecked===false"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="coursePick(scope.row)">选课
            </el-button>
          </template>
        </el-table-column>
      </paginate-table>
    </el-card>

    <el-dialog title="新建课程" :visible.sync="editDialogOpen" width="40%">

      <el-form :inline="true" :model="courseForm" class="demo-form-inline">
        <el-form-item label="所属科目">
          <subject-selector v-model="courseForm.subjectId"></subject-selector>
        </el-form-item>
        <el-form-item label="课程介绍">
          <el-input v-model="courseForm.subtitle" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="courseForm.range"
            type="datetimerange"
            align="right"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="其他任课教师">
          <user-selector v-model="courseForm.teacherIds"></user-selector>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import PaginateTable from './PaginateTable'
import SubjectSelector from './SubjectSelector'
import UserSelector from './UserSelector'

import getCourse from '../api/course/getCourse'
import { errorTip, successTip } from '@/utils/tips'
import { forDate } from '@/utils/time'

import store from '../store'

export default {
  name: 'course',
  components: { PaginateTable, SubjectSelector, UserSelector },
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
      courseForm: {
        endTime: 0,
        range: [],
        startTime: 0,
        subjectId: 0,
        subtitle: '',
        teacherIds: []
      },
      editDialogOpen: false
    }
  },
  methods: {
    changePage (pageNum) {
      const params = getCourse.initParams()
      params.myChosen = this.myChosenChecked
      params.myCreated = this.myCreatedChecked
      params.myTaught = this.myTaughtChecked
      params.pageNum = pageNum
      getCourse.request(params)
        .then((data) => {
          this.courseTable = data.results
          this.pagination = data.pagination
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
      this.changePage(1)
    },
    typeFormatter: function (row, column) {
      return row.teacherNames.join(',')
    },
    dateFormatter: function (row, column, cellValue, index) {
      return forDate(cellValue)
    },
    onSubmit () {
      this.courseForm.startTime = this.courseForm.range[0] / 1000
      this.courseForm.endTime = this.courseForm.range[1] / 1000
      this.$axios.post('api/v1/teacher/courses', this.courseForm)
        .then(value => {
          this.editDialogOpen = false
          successTip('创建成功')
        })
        .catch(errorTip)
      this.query()
    }
  }
}
</script>
<style type="less" scoped>
.teacher-operation {
  display: none;
}
</style>
