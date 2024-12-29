<template>
  <div class="analysis-container">
    <!-- 数据概览 -->
    <div class="overview-cards">
      <div v-for="(item, index) in overviewData" :key="index" class="card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.value }}</p>
      </div>
    </div>

    <!-- 图表部分 -->
    <div class="charts">
      <!-- 报名人数与参与人数对比柱状图 -->
      <div id="barChart" class="chart" />

      <!-- 消费金额趋势折线图 -->
      <div id="lineChart" class="chart" />
    </div>

    <!-- 数据表格 -->
    <table class="data-table">
      <thead>
        <tr>
          <th>活动名称</th>
          <th>报名人数</th>
          <th>参与人数</th>
          <th>消费金额</th>
          <th>转化率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
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
      overviewData: [
        { title: '总报名人数', value: 5000 },
        { title: '总参与人数', value: 4500 },
        { title: '总消费金额', value: '￥1,200,000' }
      ],
      tableData: [
        { name: '摄影讲座', signUp: 150, participate: 140, amount: 3000 },
        { name: '羽毛球比赛', signUp: 200, participate: 180, amount: 5000 },
        { name: '文化之旅', signUp: 300, participate: 270, amount: 8000 }
      ]
    }
  },
  mounted() {
    this.initBarChart()
    this.initLineChart()
  },
  methods: {
    initBarChart() {
      const barChart = echarts.init(document.getElementById('barChart'))
      const option = {
        title: { text: '报名人数与参与人数对比' },
        tooltip: {},
        legend: { data: ['报名人数', '参与人数'] },
        xAxis: { data: ['摄影讲座', '羽毛球比赛', '文化之旅'] },
        yAxis: {},
        series: [
          { name: '报名人数', type: 'bar', data: [150, 200, 300] },
          { name: '参与人数', type: 'bar', data: [140, 180, 270] }
        ]
      }
      barChart.setOption(option)
    },
    initLineChart() {
      const lineChart = echarts.init(document.getElementById('lineChart'))
      const option = {
        title: { text: '消费金额趋势' },
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
