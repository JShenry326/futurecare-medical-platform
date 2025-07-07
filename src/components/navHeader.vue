<template>
  <div class="header-container flex-box space-between">
    <div class="flex-box">
      <el-icon @click="store.commit('collapseMenu')" class="icon" size="20"><Fold /></el-icon>
      <ul class="flex-box">
        <li v-for="(item, index) in selectMenu" :key="item.path" :class="{ selected: route.path === item.path }" class="tab flex-box">
          <el-icon size="12"><component :is="item.icon" /></el-icon>
          <router-link class="flex-box text" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon @click="closeTab(item, index)" class="close" size="12"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <el-dropdown @command="handleClick">
      <div class="el-dropdown-link flex-box">
        <el-avatar :src="userInfo.avatar" />
        <p class="user-name">{{ userInfo.name }}</p>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()
const selectMenu = computed(() => store.state.menu.selectMenu)
// 点击关闭tab
const closeTab = (item, index) => {
  store.commit('closeMenu', item)
  // 删除非当前页标签的跳转逻辑
  if (item.path !== route.path) {
    return
  }
  const selectMenuData = selectMenu.value

  // 如果删除的是当前页标签
  // 删除的最后一项
  if (index === selectMenuData.length) {
    // 如果是最后一个，跳转至首页
    if (!selectMenuData.length) {
      router.push({
        path: '/dashboard'
      })
    } else {
      router.push({
        path: selectMenuData[index - 1].path
      })
    }
  } else {
    //  如果删除的是中间位置 tag
    router.push({
      path: selectMenuData[index].path
    })
  }
}

const userInfo = reactive(JSON.parse(localStorage.getItem('userInfo')))
const handleClick = command => {
  if (command === 'cancel') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('v3pz')
    // 清除cookie中的menu
    // 跳转到登录页
    // router.push('/login')
    window.location.href = window.location.origin
  }
}
</script>
<style lang="less" scoped>
.flex-box {
  height: 100%;
  display: flex;
  align-items: center;
  &.space-between {
    justify-content: space-between;
  }
}
.header-container {
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .icon {
    width: 45px;
    height: 100%;
  }
  .icon:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
  .tab {
    padding: 0 10px;
    height: 100%;
    .text {
      margin: 0 5px;
    }
    .close {
      visibility: hidden;
    }
    &.selected {
      background-color: #f5f5f5;
      i {
        color: #409eff;
      }
      a {
        color: #409eff;
      }
    }
  }
  .tab:hover {
    background-color: #f5f5f5;
    .close {
      visibility: inherit;
      cursor: pointer;
      color: #000;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
  .user-name {
    margin-left: 10px;
  }
}
</style>
