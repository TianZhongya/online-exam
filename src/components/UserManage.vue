<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">用户管理</div>
      </el-col>
      <el-col :span="4" :offset="13">
        <el-input @change="query"
          v-model="keyword"
          size="mini"
          placeholder="输入关键字搜索" />
      </el-col>
      <el-col :span="1" >
        <el-button @click="query" type="primary" icon="el-icon-search" circle></el-button>
      </el-col>
    </el-row>

    <paginate-table :data-list="userList" :pagination="pagination" :page-change="changePage">
      <el-table-column label="id" prop="id" />
      <el-table-column label="登录名" prop="username" />
      <el-table-column label="真实姓名" prop="nickname" />
      <el-table-column label="角色" prop="roleId" :formatter="roleIdToName" />
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">Delete
          </el-button>
        </template>
      </el-table-column>
    </paginate-table>
  </div>
</template>

<script>
import PaginateTable from './PaginateTable'

import store from '../store'
import searchUser from '../api/user/searchUser'
import deleteUser from '../api/user/deleteUser'
import { errorTip, successTip } from '@/utils/tips'
import { forName } from '@/api/baseClass'

export default {
  name: 'user',
  components: { PaginateTable },
  created () {
    this.query()
  },
  data () {
    return {
      state: store.state,
      keyword: '',
      userList: [],
      pagination: {},
      roleIdToName: forName,
      editDialogOpen: false
    }
  },
  methods: {
    query () {
      this.changePage(1)
    },
    changePage (pageNum) {
      const params = searchUser.initParams()
      params.name = this.keyword
      params.roleId = null
      params.perPage = 20
      params.pageNum = pageNum
      console.log(params)
      searchUser.request(params)
        .then(resp => {
          this.userList = resp.results
          this.pagination = resp.pagination
        })
        .catch(errorTip)
    },
    handleDelete (id) {
      deleteUser.request(id)
        .then(value => {
          successTip('删除成功')
          this.query()
        })
        .catch(errorTip)
    }
  }
}
</script>

<style scoped>

</style>
