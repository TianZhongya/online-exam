<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
      <!--      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle style="float: right"></el-button>-->
    </el-breadcrumb>
    <el-card>
      <el-table :data="examList">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="subjectName" label="科目名称"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFormatter" width="150"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFormatter" width="150"></el-table-column>
        <el-table-column prop="paperTitle" label="试卷标题"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId!==3" prop="examRecord" label="作答状态" :formatter="statusFormatter"
                         width="150"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId===3" align="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="false"
                       size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="openStats(scope.row)">统计数据
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="(!scope.row.examRecord)||scope.row.examRecord.releaseStatusId<=1" size="mini"
                       type="primary" @click="joinExam(scope.row)">进入考试
            </el-button>
            <el-button v-if="scope.row.examRecord && scope.row.examRecord.releaseStatusId>1" size="mini" type="primary">
              得分:{{ scope.row.examRecord.factScore }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="统计" :visible.sync="statsDialogOpen" width="50%">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._90/stat._all*100"></el-progress>>90%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._80/stat._all*100" status="success"></el-progress>>80%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._70/stat._all*100" status="warning"></el-progress>>70%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._60/stat._all*100" status="exception"></el-progress>>60%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._00/stat._all*100" status="exception"></el-progress>&lt;60%
    </el-dialog>
  </div>
</template>

<script>
import { errorTip, successTip } from '@/utils/tips'
import { dateTimeFormatter } from '@/utils/time'
import store from '../store'
import axios from 'axios'
export default {
  name: 'examPlan',
  data () {
    return {
      state: store.state,
      userType: '',
      pagination: {},
      dateTimeFormatter: dateTimeFormatter,
      examList: [],
      editDialogOpen: false,
      statsDialogOpen: false,
      examForm: {
        courseId: '',
        range: [],
        endTime: 0,
        paperId: '',
        startTime: 0
      },
      papers: [],
      statusFormatter (row, col, record, index) {
        const id = record ? record.releaseStatusId : 0
        // '0-未答卷，1-已开考，开始计时，2-已交卷，等待判卷，4-完成;
        if (id === 0) {
          return '未答卷'
        } else if (id === 1) {
          return '正在作答，计时中'
        } else if (id === 2) {
          return '已交卷，等待判卷'
        } else if (id === 4) {
          return '出分了'
        }
      },
      stat: {
        _80: 0,
        _90: 1,
        _60: 0,
        _70: 0,
        _00: 0,
        _all: 0
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
    openStats (row) {
      console.log(row)
      this.statsDialogOpen = true

      axios.get('/api/v1/teacher/plans/' + row.id + '/stats')
        .then(value => {
          this.stat = value
        })
        .catch(errorTip)
    },
    joinExam (row) {
      console.log(row.id)
      this.$router.push('/home/plan/' + row.id + '/paper')
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
    },
    forStatusName (id) {
      // '0-未答卷，1-已开考，开始计时，2-已交卷，等待判卷，4-完成;
      if (id === 0) {
        return '未答卷'
      } else if (id === 1) {
        return '正在作答，计时中'
      } else if (id === 2) {
        return '已交卷，等待判卷'
      } else if (id === 4) {
        return '出分了'
      }
    },
    getStats (planId) {

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
