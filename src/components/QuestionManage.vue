<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="2">
        <div class="grid-content bg-purple">题库管理</div>
      </el-col>
      <el-col :span="2">
        <el-checkbox v-model="form.myCreate" @change="query">我创建的</el-checkbox>
      </el-col>
      <el-col :span="5">
        科目
        <subject-selector v-model="form.subjectId" @change="query"></subject-selector>
      </el-col>
      <el-col :span="8">
        <question-type-selector v-model="form.typeId" @change="query">
          <el-radio :label="null">全部</el-radio>
        </question-type-selector>
      </el-col>
      <el-col :span="4">
        <el-input @change="query"
                  v-model="form.keyword"
                  size="mini"
                  placeholder="输入关键字搜索" />
      </el-col>
      <el-col :span="1">
        <el-button @click="query" type="primary" icon="el-icon-search" circle></el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button @click="addDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle
        ></el-button>
      </el-col>
    </el-row>
    <paginate-table :data-list="questionList" :pagination="pagination" :page-change="changePage"
                    @row-click="openDetail">
      <el-table-column label="id" prop="id" width="60" />
      <el-table-column label="类型" prop="typeId" :formatter="typeFormatter" width="60" />
      <el-table-column label="标题" resizable prop="description.title" show-overflow-tooltip />
      <el-table-column label="创建者id" prop="creatorId" width="90" />
      <el-table-column label="创建人" prop="creatorName" width="90" />
      <el-table-column label="科目" prop="subjectName" width="100" />
      <el-table-column align="right" width="90">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">Delete
          </el-button>
        </template>
      </el-table-column>
    </paginate-table>

    <el-dialog title="详情" :visible.sync="detailOpened" width="40%">
      <el-card class="box-card">
        <div>
          id:{{ detail.id }}
        </div>
        <div>
          创建人: {{ detail.creatorId }} {{ detail.creatorName }}
        </div>
        <div>
          科目:{{ detail.subjectId }} {{ detail.subjectName }}
        </div>
        <div>
          类型:{{ forTypeName(detail.typeId) }}
        </div>
        <el-divider>题目</el-divider>
        <div>
          {{ detail.description.title }}
        </div>
        <div v-if="detail.typeId===1||detail.typeId===2">
          <el-divider>选项</el-divider>
          <div v-for="option in detail.description.options" :key="option.id">{{ String.fromCharCode(option.id + 65) }}:
                                                                             {{ option.name }}
          </div>
        </div>
        <el-divider>答案</el-divider>
        <div v-if="detail.typeId===1">
          {{ String.fromCharCode(detail.answer.optionId + 65) }}
        </div>
        <div v-if="detail.typeId===2">
          {{ detail.answer.optionIds.map(value => String.fromCharCode(value + 65)).join(',') }}
        </div>
        <div v-if="detail.typeId===3">
          {{ detail.answer.trueOrFalse ? '√' : '×' }}
        </div>
        <div v-if="detail.typeId===5">
          {{ detail.answer.text }}
        </div>
      </el-card>
    </el-dialog>

    <el-dialog title="新建题目" :visible.sync="addDialogOpen" width="40%">

      <el-form :inline="true" :model="newQuestion" class="demo-form-inline">
        <el-form-item label="所属科目">
          <subject-selector v-model="newQuestion.subjectId"></subject-selector>
        </el-form-item>
        <el-form-item label="题目描述">
          <el-input v-model="newQuestion.question.description.title" type="textarea" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <question-type-selector v-model="newQuestion.question.typeId" />
        </el-form-item>
        <!--        选择-->
        <el-card class="box-card" v-if="newQuestion.question.typeId in {1:1,2:2}">
          <div slot="header" class="clearfix">
            <el-button
              @click="newQuestion.question.description.options.push({id:newQuestion.question.description.options.length,name:''})"
              type="primary" icon="el-icon-circle-plus-outline" circle
              style="float: right; padding: 0; margin-left: 3px"
            ></el-button>
            <el-button @click="newQuestion.question.description.options.pop()" type="danger"
                       icon="el-icon-remove-outline" circle style="float: right; padding: 0"
            ></el-button>
          </div>
          <div v-for="o in newQuestion.question.description.options" :key="o.id" class="text item">
            {{ toOption(o.id) }}:
            <el-form-item>
              <el-input v-model="o.name" placeholder="选项内容"></el-input>
            </el-form-item>
          </div>
          <el-radio-group v-model="newQuestion.question.answer.optionId" v-if="newQuestion.question.typeId===1">
            <el-radio v-for="o in newQuestion.question.description.options" :key="o.id" :label="o.id">
              {{ toOption(o.id) }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="newQuestion.question.answer.optionIds" v-if="newQuestion.question.typeId===2">
            <el-checkbox v-for="o in newQuestion.question.description.options" :key="o.id" :label="o.id">
              {{ toOption(o.id) }}
            </el-checkbox>
          </el-checkbox-group>
        </el-card>
        <!--        判断-->
        <el-card class="box-card" v-if="newQuestion.question.typeId===3">
          <el-radio-group v-model="newQuestion.question.answer.trueOrFalse">
            <el-radio :label="true">√</el-radio>
            <el-radio :label="false">×</el-radio>
          </el-radio-group>
        </el-card>
        <!--        简答-->
        <el-card class="box-card" v-if="newQuestion.question.typeId===5">
            <el-input v-model="newQuestion.question.answer.text" type="textarea" placeholder="答案"></el-input>
        </el-card>
        <el-divider />
        <el-form-item inline-message>
          <el-button type="primary" @click="createQuestion">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import PaginateTable from './PaginateTable'
import queryQuestion from '@/api/question/queryQuestion'
import createQuestion from '@/api/question/createQuestion'
import deleteQuestion from '@/api/question/deleteQuestion'
import getQuestionById from '@/api/question/getQuestionById'

import SubjectSelector from './SubjectSelector'
import QuestionTypeSelector from './QuestionTypeSelector'
import { errorTip, successTip } from '@/utils/tips'
import store from '../store'

export default {
  name: 'QuestionManage',
  components: { PaginateTable, SubjectSelector, QuestionTypeSelector },
  created () {
    this.query()
  },
  data () {
    return {
      state: store.state,
      questionList: [],
      pagination: {},
      form: {
        myCreate: false,
        keyword: '',
        subjectId: null,
        typeId: null
      },
      typeFormatter: createQuestion.typeFormatter,
      forTypeName: createQuestion.forTypeName,
      detailOpened: false,
      addDialogOpen: false,
      detail: {
        id: 0,
        subjectId: 0,
        subjectName: '',
        typeId: 1,
        creatorId: 0,
        creatorName: 'xxx',
        description: {
          options: [
            {
              id: 0,
              name: 'string'
            }
          ],
          title: 'string'
        },
        answer: {
          optionId: 0,
          optionIds: [
            0
          ],
          text: '',
          trueOrFalse: true
        }
      },
      newQuestion: {
        subjectId: 0,
        question: {
          typeId: 1,
          description: {
            options: [],
            title: ''
          },
          answer: {
            optionId: 0,
            optionIds: [],
            text: '',
            trueOrFalse: true
          }
        }
      }
    }
  },
  methods: {
    query () {
      this.changePage(1)
    },
    changePage (pageNum) {
      const params = queryQuestion.initParams()
      params.perPage = 20
      params.pageNum = pageNum
      params.subjectId = this.form.subjectId
      params.keyword = this.form.keyword
      params.typeId = this.form.typeId
      params.creatorId = this.form.myCreate ? this.state.userInfo.id : null
      console.log(params)
      queryQuestion.request(params)
        .then(resp => {
          this.questionList = resp.results
          this.pagination = resp.pagination
        })
        .catch(errorTip)
    },
    openDetail (row, column, event) {
      console.log('开! ' + row.id)
      getQuestionById.request(row.id)
        .then(resp => {
          this.detail = resp
          this.detailOpened = true
        })
        .catch(errorTip)
    },
    createQuestion () {
      const newQuestion = this.newQuestion
      createQuestion.request(newQuestion)
        .then(value => {
          successTip('创建成功')
          this.addDialogOpen = false
          this.query()
        })
        .catch(errorTip)
    },
    handleDelete (id) {
      console.log(id)
      deleteQuestion.request(id)
        .then(value => {
          successTip('删除成功')
          this.query()
        })
        .catch(errorTip)
    },
    toOption (id) {
      return String.fromCharCode(id + 65)
    }
  }
}
</script>

<style scoped>

</style>
