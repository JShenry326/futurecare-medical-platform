import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import PanelHead from './components/panelHead.vue'

// 刷新后的动态路由添加
const storeageStore = localStorage.getItem('v3pz')
if (storeageStore) {
  store.commit('dynamicMenu', JSON.parse(storeageStore).menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}

// 路由守卫
// 全局前置守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  console.log(token, 'token')
  // 非登陆页面token不存在
  if (to.path !== '/login' && !token) {
    return '/login'
  } else if (token && to.path === '/login') {
    // 已登录状态访问login跳转首页
    return '/dashboard'
  } else {
    return true
  }
})

const app = createApp(App)
// 路由注入需要在挂载前执行

// 图标全局引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 面板提示全局注册
app.component('PanelHead', PanelHead)

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
