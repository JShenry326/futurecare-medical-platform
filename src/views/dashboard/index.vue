<template>
  <div class="control-container">
    <panel-head :info="route" />
    <div class="card">
      <div class="user">
        <el-card class="user-card">
          <template #header>
            <div class="card-header">
              <el-image :src="user.user_img" />
              <span>{{ user.user_name }}</span>
            </div>
          </template>
          <div class="user-info">
            <div>当前权限：{{ user.permission }}</div>
            <div>登录的ip：{{ user.ip }}</div>
          </div>
        </el-card>
      </div>
      <el-card class="serive-list">
        <div class="serive-item" v-for="(item, index) in types" :key="index">
          <div class="img-box" :style="{ 'background-color': color[index] }">
            <img :src="imgs[index]" alt="" />
          </div>
          <div class="text">
            <div class="num">{{ item.num }}</div>
            <div class="name">{{ item.state }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="content">
      <div class="echart" ref="echart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import * as echarts from "echarts";
import { getControlData } from "../../api";
import { useRoute } from 'vue-router'


const route = useRoute()
const echart = ref();
const user = ref({
  user_img: "",
  user_name: "", //用户名
  timer: "", //登录时间
  ip: "", //登录ip
});
const types = ref([]);
const typeList = ref([]);
const imgs = ["dzf.png", "dfw.png", "ywc.png", "yqx.png"];
const color = ["#F05050", "#7266BA", "#23B7E5", "#27C24C"];
const getData = async () => {
  let res = await getControlData();
  console.log(res, 'res')
  let data = res?.data?.data;
  if (data) {
    user.value = data.user;
    // types.value = data.types;
    types.value = [{state: "待支付", num: 6}, {state: "待服务", num: 2}, {state: "已完成", num: 11}, {state: "已取消", num: 3}]
    // typeList.value = data.typeList;
    typeList.value = [
      {date: '2024-07-26', order_sum: 5, order_money: 2.5},
      {date: '2024-07-26', order_sum: 10, order_money: 5},
      {date: '2024-07-26', order_sum: 6, order_money: 3},
      {date: '2024-07-26', order_sum: 4, order_money: 2},
      {date: '2024-07-26', order_sum: 8, order_money: 4}
    ]
    initEchart();
  }
};
const initEchart = () => {
  let options = {
    grid: {
      left: 40,
      bottom: 0,
      right: 40,
      top: 10,
      containLabel: true,
    },
    color: ["#67CEBC"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },

      formatter: (a) => {
        return (
          a[0].seriesName +
          ":" +
          a[0].data +
          "<br />" +
          "总金额:" +
          typeList.value[a[0].dataIndex].order_money
        );
      },
    },
    legend: {
      data: ["订单数"],
    },
    xAxis: {
      data: typeList.value.map((item) => item.date),
      axisLine: { show: true, lineStyle: { width: 2, color: "#67CEBC" } },
      boundaryGap: false,
      axisLabel: {
        color: "#999",
      },
      splitLine: {
        show: true,
      },
      axisTick: false,
    },
    yAxis: {
      axisLabel: false,
      axisLine: { show: true, lineStyle: { color: "#999" } },
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        name: "订单数",
        type: "line",
        data: typeList.value.map((item) => item.order_sum),
        symbolSize: 8,
      },
    ],
  };
  var myChart = echarts.init(echart.value);
  myChart.setOption(options);
  let observer = new ResizeObserver((entries) => {
    myChart.resize();
  });
  if (echart.value) {
    observer.observe(echart.value);
  }
};
onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped>
.card {
  display: flex;
}
.user {
  margin: 20px 0;
  width: 45%;
  .user-card {
    .card-header {
      display: flex;
      .el-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 5px;
      }
      span {
        line-height: 120px;
        font-size: 28px;
        font-weight: bold;
      }
    }
    .user-info {
      color: #666;
      line-height: 30px;
    }
  }
}
.serive-list {
  background-color: #fff;
  margin: 20px;
  height: 269px;
  width: 50%;
  margin-bottom: 40px;
  ::v-deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;

    height: 95%;
    .serive-item {
      width: 50%;
      height: 50%;
      display: flex;
      justify-content: center;
      .img-box {
        width: 70px;
        height: 70px;
        text-align: center;
        margin-right: 10px;
        border-radius: 5px;
        img {
          margin: 5px;
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }

      .num {
        font-size: 25px;
        line-height: 40px;
        font-weight: bold;
      }
      .name {
        font-size: 14px;
      }
    }
  }
}
.content {
  padding: 10px;
  background-color: #fff;
  width: 95%;
  .echart {
    height: 400px;
  }
}
</style>
