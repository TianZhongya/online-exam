<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle style="float: right"></el-button>
    </el-breadcrumb>
    <el-card>
      <paginate-table :data-list="examList" :pagination="pagination">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="subjectName" label="科目名称"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFormatter"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFormatter"></el-table-column>
        <el-table-column prop="paperTitle" label="试卷标题"></el-table-column>
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
          v-if="state.userInfo.roleId===2"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="joinExam(scope.row)">进入考试
            </el-button>
          </template>
        </el-table-column>
      </paginate-table>
    </el-card>
    <el-dialog title="新建考试计划" :visible.sync="editDialogOpen" width="40%">

      <el-form :inline="true" :model="examForm" class="demo-form-inline">
        <el-form-item label="所属科目">
          <subject-selector v-model="examForm.courseId"></subject-selector>
        </el-form-item>
        <el-form-item label="试卷选择">
          <el-input v-model="examForm.paperId" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="examForm.range"
            type="datetimerange"
            align="right"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import SubjectSelector from './SubjectSelector'
import { errorTip, successTip } from '../utils/tips'
import { dateTimeFormatter } from '../utils/time'
import PaginateTable from './PaginateTable'
import store from '../store'

export default {
  name: 'examPlan',
  components: { PaginateTable, SubjectSelector },
  data () {
    return {
      state: store.state,
      userType: '',
      pagination: {},
      dateTimeFormatter: dateTimeFormatter,
      examList: [],
      editDialogOpen: false,
      examForm: {
        courseId: '',
        range: [],
        endTime: 0,
        paperId: '',
        startTime: 0
      }
    }
  },
  methods: {
    getUserType () {
      if (this.state.userInfo.roleId === 2) {
        this.userType = 'student'
      } else {
        this.userType = 'teacher'
      }
    },
    getExamList () {
      this.$axios.get('api/v1/' + this.userType + '/plans')
        .then(data => {
          this.examList = data
        })
        .catch(errorTip)
    },
    handleDelete (index, row) {
      this.$axios.delete('api/v1/teacher/plans/' + row.id)
        .then((data) => {
          this.$message.success('成功删除')
          this.getExamList()
        })
        .catch(errorTip)
    },
    joinExam (row) {
      console.log(row.id)
      this.$axios.get('api/v1/student/plans/' + row.id + '/paper')
        .then(data => {
          console.log(data)
        })
        .catch(errorTip)
    },
    onSubmit () {
      this.examForm.startTime = this.examForm.range[0] / 1000
      this.examForm.endTime = this.examForm.range[1] / 1000
      console.log(this.examForm)
      this.$axios.post('api/v1/teacher/plans', this.examForm)
        .then(value => {
          this.editDialogOpen = false
          console.log(value)
          successTip('创建成功')
          this.getExamList()
        })
        .catch(errorTip)
    }
  },
  created () {
    this.getUserType()
    console.log(this.userType)
    this.getExamList()
  }
}
</script>

<style lang="less" scoped>
</style>
