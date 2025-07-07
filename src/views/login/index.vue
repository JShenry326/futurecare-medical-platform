<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <!-- public目录下的资源可以通过"/"访问 -->
          <!-- <img src="/login-head.png" alt=""> -->
          <!-- 或者通过vite静态资源处理方法 -->
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link @click="handleChange" type="primary" underline>{{ formType ? '返回登录' : '注册账号' }}</el-link>
      </div>
      <el-form ref="loginFormRef" style="max-width: 600px" :model="loginForm" status-icon :rules="rules" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" :prefix-icon="UserFilled" placeholder="手机号" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" :prefix-icon="Lock" type="passWord" placeholder="密码" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" :prefix-icon="Lock" placeholder="验证码" autocomplete="off">
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :style="{ width: '100%' }" type="primary" @click="submitForm(loginFormRef)">
            {{ formType ? '注册账号' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script setup>
import { ref, reactive, onMounted, computed, toRaw } from 'vue'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { getCode, authentication, login, menuPermissions } from '../../api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 登录页图片
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

// 表单数据
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
})

// 账号校验规则
const validateUser = (rule, value, callback) => {
  // 不能为空
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    reg.test(value) ? callback() : callback(new Error('手机号格式不对,请输入正确手机号'))
  }
}

// 密码校验规则
const validatePass = (rule, value, callback) => {
  // 不能为空
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/
    reg.test(value) ? callback() : callback(new Error('密码格式不对,需要4到16位字母/数字/下划线/减号'))
  }
}
const rules = reactive({
  userName: [{ validator: validateUser, trigger: 'blur' }],
  passWord: [{ validator: validatePass, trigger: 'blur' }]
})
// 提交表单
const loginFormRef = ref()
const router = useRouter()
const store = useStore()

const routerList = computed(() => store.state.menu.routerList)

const submitForm = formEl => {
  formEl.validate((valid, fields) => {
    if (valid) {
      // 当前是登录页面
      if (!formType.value) {
        login(loginForm).then(({ data }) => {
          console.log(data)
          if (data.code === 10000) {
            ElMessage.success('登录成功！')
            // 将token放入缓存
            localStorage.setItem('token', data.data.token)
            localStorage.setItem('userInfo', JSON.stringify(data.data.userInfo))
            menuPermissions()
              .then(({ data: permission }) => {
                // console.log(permission.data, 'permission')
                store.commit('dynamicMenu', permission.data)
                console.log(toRaw(routerList.value), 'routerList')
                console.log(router)
                // 响应式数据转变为普通数据
                toRaw(routerList.value).forEach(item => {
                  router.addRoute('main', item)
                })
              })
              .then(() => {
                router.push('/')
              })
          }
        })
      } else {
        // 如果是注册页面
        authentication(loginForm).then(() => {
          ElMessage.success('注册成功！请登录')
          formType.value = 0
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 切换表单(0为登录，1为注册)
const formType = ref(0)
// 点击切换登录与注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1
}

// 发送短信
let flag = false
const countdown = reactive({
  validText: '获取验证码',
  time: 60
})
const countdownChange = () => {
  // 已经发送的不处理
  if (flag) return
  // 手机号正则
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  // 判断手机号是否正确
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: '请检查手机号是否正确',
      type: 'warning'
    })
  }
  // 倒计时
  const time = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.validText = '获取验证码'
      countdown.time = 60
      flag = false
      clearInterval(time)
    } else {
      countdown.time -= 1
      countdown.validText = `剩余${countdown.time}s`
    }
  }, 1000)
  flag = true
  console.log('发送短信')
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('验证码已发送，请注意查收')
    } else {
      ElMessage.error(data.message)
    }
  })
}
</script>
<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
