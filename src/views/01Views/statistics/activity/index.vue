<template>
  <div class="analysis-container">
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="overview-cards">
      <div v-for="(item, index) in overviewData[activeTab]" :key="index" class="card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.value }}</p>
      </div>
    </div>

    <div class="charts">
      <div id="barChart" class="chart" />
      <div id="lineChart" class="chart" />
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>报名人数</th>
          <th>参与人数</th>
          <th>消费金额</th>
          <th>转化率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData[activeTab]" :key="index">
          <td>{{ row.name }}</td>
          <td>{{ row.signUp }}</td>
          <td>{{ row.participate }}</td>
          <td>￥{{ row.amount }}</td>
          <td>{{ ((row.participate / row.signUp) * 100).toFixed(1) }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      tabs: ['活动', '课程', '旅游'],
      activeTab: '活动',
      overviewData: {
        活动: [
          { title: '活动总数', value: 10 },
          { title: '报名人数', value: 2000 },
          { title: '消费金额', value: '￥300,000' }
        ],
        课程: [
          { title: '课程总数', value: 5 },
          { title: '报名人数', value: 1000 },
          { title: '消费金额', value: '￥150,000' }
        ],
        旅游: [
          { title: '旅游总数', value: 3 },
          { title: '报名人数', value: 500 },
          { title: '消费金额', value: '￥200,000' }
        ]
      },
      tableData: {
        活动: [
          { name: '摄影讲座', signUp: 150, participate: 140, amount: 3000 },
          { name: '羽毛球比赛', signUp: 200, participate: 180, amount: 5000 }
        ],
        课程: [
          { name: '艺术课程', signUp: 100, participate: 90, amount: 2000 },
          { name: '语言课程', signUp: 200, participate: 180, amount: 4000 }
        ],
        旅游: [
          { name: '文化之旅', signUp: 300, participate: 270, amount: 8000 },
          { name: '探险之旅', signUp: 200, participate: 180, amount: 7000 }
        ]
      }
    }
  },
  watch: {
    activeTab() {
      this.initCharts()
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.initBarChart()
      this.initLineChart()
    },
    initBarChart() {
      const barChart = echarts.init(document.getElementById('barChart'))
      const currentData = this.tableData[this.activeTab]
      const option = {
        title: { text: `${this.activeTab}报名人数与参与人数对比` },
        tooltip: {},
        legend: { data: ['报名人数', '参与人数'] },
        xAxis: { data: currentData.map(item => item.name) },
        yAxis: {},
        series: [
          { name: '报名人数', type: 'bar', data: currentData.map(item => item.signUp) },
          { name: '参与人数', type: 'bar', data: currentData.map(item => item.participate) }
        ]
      }
      barChart.setOption(option)
    },
    initLineChart() {
      const lineChart = echarts.init(document.getElementById('lineChart'))
      const option = {
        title: { text: `${this.activeTab}消费金额趋势` },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
        yAxis: { type: 'value' },
        series: [
          { name: '消费金额', type: 'line', data: [12000, 15000, 20000] }
        ]
      }
      lineChart.setOption(option)
    }
  }
}
</script>

  <style scoped>
  .analysis-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .tabs {
    display: flex;
    margin-bottom: 20px;
  }

  .tabs button {
    margin-right: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #f5f5f5;
    cursor: pointer;
    border-radius: 4px;
  }

  .tabs button.active {
    background-color: #1890ff;
    color: #fff;
  }

  .overview-cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .card {
    flex: 1;
    margin: 0 10px;
    padding: 20px;
    background-color: #f5f5f5;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .charts {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .chart {
    flex: 1;
    margin: 0 10px;
    height: 400px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }

  .data-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  </style>
