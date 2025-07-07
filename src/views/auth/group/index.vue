<template>
  <div class="group-container">
    <panel-head :info="route" />
    <div class="btns">
      <el-button @click="open(null)" type="primary" size="small" :icon="Plus">新增</el-button>
    </div>
    <el-table :data="tableData.list" stripe style="width: 100%">
      <el-table-column label="id" prop="id" />
      <el-table-column label="昵称" prop="name" />
      <el-table-column label="菜单权限" prop="permissionName" width="500px" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-info">
      <el-pagination v-model:current-page="paginationData.pageNum" size="small" :page-size="paginationData.pageSize" :background="false" layout="total, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="添加权限" width="500">
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="名称" prop="authName">
          <el-input v-model="form.authName" placeholder="请填写权限名称" />
        </el-form-item>
        <el-form-item label="权限" prop="authInfo">
          <el-tree ref="treeRef" style="max-width: 600px" :data="permissionData" show-checkbox node-key="id" :default-expanded-keys="[2]" :default-checked-keys="defaultKeys" :props="defaultProps" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { Plus, Delete } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { userGetMenu, userSetmenu, menuList } from '../../../api'
import { useRoute } from 'vue-router'

const route = useRoute()
// 请求参数
const paginationData = reactive({
  // 当前页码，默认第一页
  pageNum: 1,
  // 每页条数
  pageSize: 2
})

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 树形菜单权限数据
const permissionData = ref([])

onMounted(() => {
  getListData()
  // 获取权限菜单
  userGetMenu().then(({ data }) => {
    permissionData.value = data.data
  })
})

// 请求列表数据
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data
    tableData.list = list
    tableData.total = total
  })
}

const form = reactive({
  id: '',
  name: ''
})

// 表单验证
const formRef = ref()
const rules = reactive({
  authName: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
})
// 点击页码回调
const handleCurrentChange = val => {
  paginationData.pageNum = val
  getListData()
}
// 点击每页显示条数回调
const handleSizeChange = val => {
  paginationData.pageSize = val
  getListData()
}
// 弹窗的显示隐藏
const dialogFormVisible = ref(false)
// 打开弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true
  nextTick(() => {
    // 如果是编辑
    if (rowData) {
      Object.assign(form, { id: rowData.id, authName: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}
// 弹窗关闭前的操作
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys(defaultKeys)
}

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 选中权限
const treeRef = ref()
// 默认选中的权限
const defaultKeys = [4, 5]
// 弹窗表单提交校验
const confirm = async formEl => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const name = form.authName
      const id = form.id
      // 获取选中的权限
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetmenu({ id, name, permissions }).then(() => {
        beforeClose()
        getListData()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
