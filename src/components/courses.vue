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
          label="任课教师" :formatter="typeFormatter">
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId==3"
          align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import getCourse from '../api/course/getCourse'
import { errorTip } from '../utils/tips'
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
      ]
    }
  },
  methods: {
    handleDelete (index, row) {
      console.log(index, row)
      this.$axios.delete('api/v1/teacher/courses/' + row.id)
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
    }
  }
}
</script>
<style type="less" scoped>
  .teacher-operation{
    display: none;
  }
</style>
