<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
<!--      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle style="float: right"></el-button>-->
    </el-breadcrumb>
    <el-card>
      <el-table :data="examList">
        <el-table-column prop="id" label="ID" width="60" ></el-table-column>
        <el-table-column prop="subjectName" label="科目名称"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFormatter"  width="150"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFormatter"  width="150"></el-table-column>
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
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { errorTip, successTip } from '@/utils/tips'
import { dateTimeFormatter } from '@/utils/time'
import store from '../store'

export default {
  name: 'examPlan',
  components: { },
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
      },
      papers: []
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
