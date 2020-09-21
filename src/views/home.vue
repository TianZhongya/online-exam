<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.svg" style="display: inline-block; vertical-align: sub; margin-right: 10px;">
        <span>在线考试系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <div class="personal">
          <img src="../assets/user.png" style="width:100px;border-radius: 50%;padding: 10px">
          <div>{{ state.userInfo.nickname }}</div>
        </div>
        <!--侧边栏菜单区域-->
        <el-menu
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="$route.path"
        >
          <el-menu-item :index="'/home/'+item.path" v-for="item in menulist" :key="item.id">
            <template>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
          </el-menu-item>
        </el-menu>
<!--        <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff"-->
<!--                 active-text-color="#ffd04b">-->
<!--          &lt;!&ndash;一级菜单&ndash;&gt;-->
<!--          <el-menu-item index="/home/exam">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>考试查询</span>-->
<!--            </template>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="/home/grade">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>成绩查询</span>-->
<!--            </template>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="/home/subject">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>选择课程</span>-->
<!--            </template>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="/home/curriculum">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>查看课表</span>-->
<!--            </template>-->
<!--          </el-menu-item>-->
<!--        </el-menu>-->
      </el-aside>
      <!--右侧内容区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { errorTip } from '@/utils/tips'
import store from '../store'

export default {
  created () {
    this.$axios.get('api/v1/auth')
      .then((data) => {
        store.state.userInfo.id = data.id
        store.state.userInfo.username = data.username
        store.state.userInfo.nickname = data.nickname
      }).catch(reason => {
        errorTip(reason)
        return this.$router.push('/')
      })
  },
  data () {
    return {
      state: store.state
    }
  },
  methods: {
    logout () {
      this.$axios.delete('api/v1/auth')
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    getMenuList (id) {
      switch (id) {
        case 1: return [{ id: 0, path: 'exam', authName: '考试列表' }, { id: 1, path: 'courses', authName: '查询课程' }]
        case 2: return [{ id: 0, path: 'exam', authName: '考试列表' }, { id: 1, path: 'grade', authName: '查看成绩' }]
        case 3: return [{ id: 0, path: 'exam', authName: '考试列表' }, { id: 1, path: 'grade', authName: '查看成绩' }]
      }
    }
  }
}
</script>

<style type="less" scoped>
.personal {
  height: 180px;
  background-color: #847b7b;
}

.home_container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1f2329;
  color: #fff;
  font-size: 20px;
  text-align: center;
  line-height: 60px;

  > div {
    display: flex;
    align-items: center;
    background-color: #1f2329;
    color: rgba(255, 255, 255, 0.97);
    font-size: 20px;
    text-align: center;
    line-height: 60px;

    > div {
      display: flex;
      align-items: center;
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}

  .el-main {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 40px;
  }
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 40px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
