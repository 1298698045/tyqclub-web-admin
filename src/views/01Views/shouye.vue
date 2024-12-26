<template>
  <div class="wrapper">
    <div class="form">
      <div class="form-item">
        <div class="form-item-label">
          日期
        </div>
        <div class="form-item-field">
          <el-date-picker
            v-model="date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="statistics-wrap">
      <div class="statisticsPanel">
        <div class="left-box">
          <div class="module-img">
            <img src="@/assets/img/logo2.jpg" alt="">
          </div>
        </div>
        <div class="right-box">
          <div class="number">
            100
          </div>
          <div class="label">会员数量</div>
        </div>
      </div>
      <div class="statisticsPanel chartItem">
        <div>
          <div class="title">年龄分布</div>
          <div class="chartBox" id="chart-age"></div>
        </div>
      </div>
      <div class="statisticsPanel chartItem">
        <div>
          <div class="title">性别比例</div>
          <div class="chartBox" id="chart-gender"></div>
        </div>
      </div>
      <div class="statisticsPanel chartItem">
        <div>
          <div class="title">报名数量</div>
          <div class="chartBox" id="chart-sign"></div>
        </div>
      </div>
      <!-- <div class="statisticsPanel">
        <div class="left-box">
          <div class="module-img">
            <img src="@/assets/img/logo2.jpg" alt="">
          </div>
        </div>
        <div class="right-box">
          <div class="number">
            100
          </div>
          <div class="label">性别比例</div>
        </div>
      </div>
      <div class="statisticsPanel">
        <div class="left-box">
          <div class="module-img">
            <img src="@/assets/img/logo2.jpg" alt="">
          </div>
        </div>
        <div class="right-box">
          <div class="number">
            100
          </div>
          <div class="label">报名数量</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  import * as echarts from 'echarts';
  export default {
    data() {
      return {
        date: ""
      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(()=>{
        this.getAgeChart();
        this.getGenderChart();
        this.getSignChart();
      })
    },
    methods: {
      getAgeChart() {
        let chartDom = document.getElementById("chart-age");
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: '0%',
            data: ['18', '20']
          },
          color: ['#3399ff', 'pink'],
          series: [
            {
              name: '年龄',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 18, name: '18' },
                { value: 10, name: '20' },
              ]
            }
          ]
        };

        option && myChart.setOption(option);
      },
      getGenderChart() {
        let chartDom = document.getElementById("chart-gender");
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: '0%',
            data: ['男', '女']
          },
          color: ['blue', 'pink'],
          series: [
            {
              name: '性别',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 18, name: '男' },
                { value: 10, name: '女' },
              ]
            }
          ]
        };

        option && myChart.setOption(option);
      },
      getSignChart() {
        let chartDom = document.getElementById("chart-sign");
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: '0%',
            data: ['活动', '课程', '旅游']
          },
          series: [
            {
              name: '报名数量',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 18, name: '活动' },
                { value: 10, name: '课程' },
                { value: 10, name: '旅游' },
              ]
            }
          ]
        };

        option && myChart.setOption(option);
      }
    },
  }
</script>
<style lang="scss">
  .wrapper {
    width: 100%;
    min-height: calc(100vh - 84px);
    background: #f4f4f4;

    .statistics-wrap {
      display: flex;
      padding: 10px 0 10px 10px;
    }

    .statisticsPanel {
      width: calc(25% - 10px);
      height: 200px;
      background: #fff;
      box-shadow: rgba(0, 0, 0, 0.05882353) 0px 3px 6px 2px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 10px;
      padding: 20px;

      &:nth-child(4n) {
        margin-right: 0;
      }

      .label {
        color: #666666;
      }

      .left-box {
        margin-right: 20px;
      }

      .module-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .number {
        font-size: 30px;
        color: #2f5aa5;
        font-weight: 500;
      }
    }
  }
  .statisticsPanel.chartItem{
    display: block;
    .title{
      color: #666666;
    }
  }
  .chartBox{
    width: 300px;
    height: 150px;
  }
  .form{
    padding: 0 10px;
    .form-item{
      display: flex;
      align-items: center;
      padding: 10px 0;
      .form-item-label{
        margin-right: 10px;
      }
    }
  }
</style>