<template>
  <div>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">管理课程</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        <el-checkbox v-model="myCreate" @change="query">我创建的</el-checkbox>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">{{date}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import getSubject from '@/api/subject/getSubject'
import { errorTip } from '@/utils/tips'
import { forDate } from '@/utils/time'

export default {
  name: 'Subject',
  created () {
    this.query()
  },
  data () {
    return {
      myCreate: false,
      date: forDate(1600695740)
    }
  },
  methods: {
    query () {
      const params = getSubject.initParams()
      params.personal = this.myCreate
      getSubject.request(params)
        .then(value => {
          console.log(value)
        })
        .catch(errorTip)
    }
  }
}
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
