<template>
  <div class="login_container">
    <div class="login_box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <h3>在线考试系统</h3>
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="userFlag" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      regEmail: /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/,
      regName: /^[a-z_-]{3,16}$/,
      regMobile: /^0?1[3|4|5|8][0-9]\d{8}$/,
      userFlag: '',
      loginForm: {
        email: '', // wangzy5517@mails.jlu.edu.cn
        mobile: '', // 15526649681
        password: 'qwertyuiop', // qwertyuiop
        username: '' // wzy
      },
      loginFormRules: {
        userFlag: [
          { required: true, message: '请输入字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 0, max: 16, message: '长度为8~16位字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (this.regMobile.test(this.userFlag)) this.loginForm.mobile = this.userFlag
        if (this.regEmail.test(this.userFlag)) this.loginForm.email = this.userFlag
        if (this.regName.test(this.userFlag)) this.loginForm.username = this.userFlag
        if (!valid) return
        const { data: res } = await this.$http.post('api/v1/auth', JSON.stringify(this.loginForm))
        const { data: get } = await this.$http.get('api/v1/auth')
        if (res.msg !== 'OK') return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data)
        window.sessionStorage.setItem('nickname', get.data.nickname)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width:100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
