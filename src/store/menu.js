const state = localStorage.getItem('v3pz')
  ? localStorage.getItem('v3pz').menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [],
      menuActive: '1-1'
    }

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    // 对数据进行去重处理
    if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  updateMenuActive(state, value) {
    state.menuActive = value
  },
  closeMenu(state, item) {
    // 找到点击数据的索引
    const index = state.selectMenu.findIndex(val => val.name === item.name)
    // 通过索引删除数组指定元素
    state.selectMenu.splice(index, 1)
  },
  dynamicMenu(state, payload) {
    // 通过 import.meta.glob 动态引入路由组件
    const modules = import.meta.glob('../views/**/**/*.vue')
    function routerSet(router) {
      router.forEach(route => {
        // 判断没有子菜单，拼接路由数据
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`
          // 拿到获取的vue组件
          route.component = modules[url]
        } else {
          routerSet(route.children)
        }
      })
    }
    routerSet(payload)
    state.routerList = payload
  }
}

export default {
  state,
  mutations
}
