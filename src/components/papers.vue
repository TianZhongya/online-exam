<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle style="float: right"></el-button>
    </el-breadcrumb>
    <el-dialog title="创建试卷" :visible.sync="editDialogOpen" width="30%">

      <el-form ref="form" :model="PaperForm" label-width="80px">
        <el-form-item label="所属科目">
          <subject-selector v-model="PaperForm.subjectId"></subject-selector>
        </el-form-item>
        <div v-for="conf in PaperForm.configs" :key="conf.typeId">
          <p> {{forTypeName(conf.typeId)}} </p>
          <el-form-item label="分数" prop="conf.score">
            <el-input-number v-model="conf.score"></el-input-number>
          </el-form-item>
          <el-form-item label="数量" prop="conf.count">
            <el-input-number v-model="conf.count"></el-input-number>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="create">创建</el-button>
          <el-button @click="editDialogOpen = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { forTypeName } from '../api/question/createQuestion.js'

import SubjectSelector from './SubjectSelector'
import { errorTip, successTip } from '../utils/tips'
export default {
  name: 'papers',
  components: { SubjectSelector },
  data () {
    return {
      editDialogOpen: false,
      PaperForm: {
        configs: [
          {
            count: 0,
            score: 0,
            typeId: 1
          },
          {
            count: 0,
            score: 0,
            typeId: 2
          },
          {
            count: 0,
            score: 0,
            typeId: 3
          },
          {
            count: 0,
            score: 0,
            typeId: 5
          }
        ],
        subjectId: 0
      },
      forTypeName
    }
  },
  methods: {
    create () {
      this.$axios.post('api/v1/teacher/papers/preview', this.PaperForm)
        .then(data => {
          console.log(data)
          successTip('创建成功')
        })
        .catch(errorTip)
    }
  }
}
</script>

<style scoped>

</style>
