<template>
  <el-menu :style="{ width: !isCollapse ? '230px' : '64px' }" :default-active="active" class="aside-container" active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
    <p class="logo-lg">
      <img v-if="isCollapse" src="../../public/logo.webp" alt="Logo" />
      <span v-else>智护未来医疗陪诊</span>
    </p>
    <tree-menu :index="1" :menuData="menuData" />
  </el-menu>
</template>
<script setup>
import { reactive, computed } from 'vue'
// import { useRouter } from 'vue-router'
import TreeMenu from './treeMenu.vue'
import { useStore } from 'vuex'

// const router = useRouter()
// const menuData = reactive(router.options.routes[0].children)
const menuData = computed(() => store.state.menu.routerList)
console.log(menuData, 'menuData')
const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)
const active = computed(() => store.state.menu.menuActive)
console.log(active)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
<style lang="less" scoped>
.aside-container {
  // min-width: 230px;
  height: 100%;
  .logo-lg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 64px;
    line-height: 50px;
    color: #fff;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
