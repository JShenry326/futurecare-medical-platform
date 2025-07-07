import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  // 通用请求的地址前缀
  // baseURL: 'https://wechatopen.mynatapp.cc/v3pz',
  baseURL: 'https:/v3pz.itndedu.com/v3pz',
  timeout: 10000 // 超时时间
})

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 不需要添加token的api
    const whiteUrl = ['/get/code', '/user/authentication', '/login']
    // 如果有token且不是白名单中的url，则添加token到请求头
    const token = localStorage.getItem('token')
    if (token && !whiteUrl.includes(config.url)) {
      config.headers['X-token'] = token
      // 临时
      // config.headers['auth'] = '13797053405'
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对于接口返回异常的数据，给用户提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message)
    }
    if (response.data.code === -2) {
      ElMessage.error('登录已过期，请重新登录！')
      // 清除token
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('v3pz')
      // 跳转到登录页
      window.location.href = '/login'
    }
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    ElMessage.error('网络异常，请检查！')
    return Promise.reject(error)
  }
)

export default http
