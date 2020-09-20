<template>
  <div class="login_container">
    <div class="login_box" v-bind:class="{hidden: loginHidden}">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <h3>在线考试系统</h3>
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="userFlag" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <div class="bottom-link">
            还没有账号?
            <el-link type="primary" class="go_register" @click="goRegister">马上注册</el-link>
          </div>
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="register_box" v-bind:class="{hidden: registerHidden}">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="80px"
               class="register_form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名（6~32个英文字符）"
                    prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="请输入6~32位密码"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="password">
          <el-input type="password" v-model="check_password" placeholder="请重新输入密码"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入姓名" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="registerForm.mobile" placeholder="请输入11~32位电话号码"
                    prefix-icon="el-icon-phone-outline"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="registerForm.roleId" placeholder="请角色">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="学生" value="2"></el-option>
            <el-option label="教师" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请码" prop="secret">
          <el-input v-model="registerForm.secret" placeholder="请输入邀请码" prefix-icon="el-icon-bell"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <div class="bottom-link">
            已经注册?
            <el-link type="primary" @click="goLogin">马上登录</el-link>
          </div>
          <el-button type="primary" round @click="register">注册</el-button>
          <el-button type="info" round @click="resetRegisterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginHidden: false,
      registerHidden: true,
      check_password: '',
      regEmail: /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/,
      regName: /^[a-zA-Z][\dA-Za-z_]{2,32}$/,
      regMobile: /^0?1[3|4|5|8][0-9]\d{8}$/,
      userFlag: '',
      loginForm: {
        email: '', // wangzy5517@mails.jlu.edu.cn
        mobile: '', // 15526649681
        password: 'qwertyuiop', // qwertyuiop
        username: '' // wzy
      },
      registerForm: {
        email: '1438472761@qq.com',
        mobile: '18343299762',
        nickname: '田忠亚',
        password: '262319',
        roleId: '1',
        secret: '',
        username: 'tianzhongya'
      },
      loginFormRules: {
        userFlag: [
          { required: true, message: '请输入字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 0, max: 16, message: '长度为8~16位字符', trigger: 'blur' }
        ]
      },
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 32, message: '长度为6~32位，必须以字母开头', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度为6~32位字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 32, message: '长度为2~32位字符', trigger: 'blur' }
        ],
        email: [
          { pattern: /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+.[a-z]+$/, message: '请正确输入邮箱', trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 32, message: '长度为11~32个数字', trigger: 'blur' },
          { pattern: /^\d{11,}$/, message: '长度为11~32个数字', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        secret: [
          { required: true, message: '请输入邀请码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    resetRegisterForm () {
      this.$refs.registerFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (this.regMobile.test(this.userFlag)) this.loginForm.mobile = this.userFlag
        if (this.regEmail.test(this.userFlag)) this.loginForm.email = this.userFlag
        if (this.regName.test(this.userFlag)) this.loginForm.username = this.userFlag
        if (!(this.loginForm.email || this.loginForm.email || this.loginForm.username)) return
        this.$axios.post('api/v1/auth', this.loginForm)
          .then(value => {
            this.$message.success('登陆成功')
            this.$router.push('/home')
          })
          .catch(reason => {
            // this.$message.error(reason.message)
          })
      })
    },
    register () {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return
        this.$axios.post('api/v1/users', this.registerForm)
          .then(value => {
            this.$message.success('注册成功')
            this.goLogin()
          })
      })
    },
    goLogin () {
      this.loginHidden = false
      this.registerHidden = true
    },
    goRegister () {
      this.loginHidden = true
      this.registerHidden = false
    }
  }
}
</script>

<style lang="less" scoped>
.hidden {
  display: none;
}

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.register_box {
  width: 450px;
  height: 600px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.bottom-link {
  display: inline-block;
  padding-right: 30px;
}

.login_form, .register_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
