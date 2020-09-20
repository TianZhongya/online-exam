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
          <div>{{nickname}}</div>
        </div>
        <!--侧边栏菜单区域-->
        <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff"
                 active-text-color="#ffd04b">
          <!--一级菜单-->
          <el-menu-item index="/home/exam">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>考试查询</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/grade">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>成绩查询</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/subject">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>选择课程</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/curriculum">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>查看课表</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--右侧内容区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>export default {
  beforeCreate () {
    const res = this.$http.get('api/v1/auth')
    res.then((v) => {
      if (!v.data.data) return this.$router.push('/')
      window.sessionStorage.setItem('nickname', v.data.data.nickname)
    }).finally(this.nickname = window.sessionStorage.getItem('nickname'))
  },
  data () {
    return {
      nickname: window.sessionStorage.getItem('nickname')
    }
  },
  methods: {
    logout () {
      const res = this.$http.delete('api/v1/auth')
      window.sessionStorage.clear()
      this.$router.push('/')
      console.log(res)
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
    }
  }

  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
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
