<template>
  <div class="order-container">
    <panel-head :info="route" />
    <div class="form">
      <el-form :model="searchForm" :inline="true">
        <el-form-item prop="out_trade_no">
          <el-input v-model="searchForm.out_trade_no" placeholder="订单号" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData.list" stripe style="width: 100%">
      <el-table-column fixed label="订单号" prop="out_trade_no" width="150" />
      <el-table-column label="就诊医院" prop="hospital_name" />
      <el-table-column label="陪诊服务" prop="service_name" />
      <el-table-column label="陪护师">
        <template #default="scope">
          <el-avatar :src="scope.row.companion.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="陪护师手机号" width="120">
        <template #default="scope">
          {{ scope.row.companion.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="总价" prop="price" />
      <el-table-column label="已付" prop="paidPrice" />
      <el-table-column label="下单时间" prop="order_start_time" width="120">
        <template #default="scope">
          {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-tag :type="statusSet(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接单状态" prop="service_state" />
      <el-table-column label="联系人手机号" prop="tel" width="120" />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.trade_state === '待服务'" confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF" title="是否确认完成？" @confirm="serverEnd(scope.row.out_trade_no)">
            <template #reference>
              <el-button type="primary" link>服务完成</el-button>
            </template>
          </el-popconfirm>
          <el-button v-else type="primary" link disabled>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-info">
      <el-pagination v-model:current-page="paginationData.pageNum" size="small" :background="false" layout="total, prev, pager, next" :total="tableData.total" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { adminOrder, updateOrder } from '../../../api'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  getList()
})

// 表单数据
const searchForm = reactive({
  out_trade_no: ''
})

// 请求参数
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

const onSubmit = () => {
  console.log(searchForm)
  getList(searchForm)
}

const getList = params => {
  adminOrder({ ...paginationData, ...params }).then(({ data }) => {
    const { list, total } = data.data
    tableData.list = list
    tableData.total = total
  })
}

const statusSet = key => {
  const statusMap = {
    已取消: 'info',
    待支付: 'warning',
    已完成: 'success'
  }
  return statusMap[key]
}

const serverEnd = id => {
  updateOrder({ id }).then(({ data }) => {
    getList()
  })
}

const handleCurrentChange = val => {
  paginationData.pageNum = val
  getList()
}
</script>
<style lang="less" scoped>
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
