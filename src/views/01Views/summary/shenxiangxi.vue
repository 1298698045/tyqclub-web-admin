<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0"
           style="width=100%">
      <tr>
        <td class="tdt"
            colspan="4"
            style="text-align:center;">
          <h2>工作日报</h2>
        </td>
      </tr>
      <tr>
        <td class="tdt">报告主题</td>
        <td class="tdt"
            style="width:500px;text-align:center;">
          {{summaryObj.title}}
        </td>
        <td class="tdt">时间</td>
        <td class="tdt"
            style="width:500px;text-align:center;">{{time}}</td>
      </tr>
      <tr>
        <td class="tdt">发起人</td>
        <td class="tdt"
            style="width:500px;text-align:center;">{{stfName}}</td>
        <td class="tdt">接收人</td>
        <td class="tdt"
            style="width:500px;text-align:center;">
          <div>
            {{summaryObj.ckStaffId}}
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt">今日内容</td>
        <td colspan="3"
            style="padding:20px 0 20px 40px">
          <div class="tableDate">
            <div class="table">
              <el-table :data="jinData"
                        ref="table"
                        tooltip-effect="dark"
                        border
                        stripe
                        style="width: 93%"
                        @selection-change='selectRow'>
                <el-table-column label="序号"
                                 type="index"
                                 width="60"
                                 align="center"></el-table-column>
                <el-table-column label="内容"
                                 align="center">
                  <template slot-scope="scope">
                    {{scope.row.content}}
                  </template>

                </el-table-column>
                <el-table-column label="完成情况">
                  <template slot-scope="scope">
                    {{scope.row.state==0?"准备中":scope.row.state==1?"进行中":"已结束"}}
                  </template>

                </el-table-column>
                <el-table-column label="工时">
                  <template slot-scope="scope">
                    {{scope.row.ctime}}
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt">评语</td>
        <td colspan="3">
          <p v-if="summaryObj.score">{{summaryObj.score}}</p>
          <el-input type="textarea"
                    class="remark"
                    v-model="summaryObj.score"
                    v-else></el-input>
        </td>
      </tr>
      <tr>
        <td class="tdt">结束</td>
        <td colspan="3">
          <el-button v-if="summaryObj.score">返回</el-button>
          <el-button v-else
                     @click="onSubmit">确定</el-button>
        </td>
      </tr>
    </table>

  </div>
</template>
<script>
import NoticSv from '@/api/systemGMT/notic'
import SummarySv from '@/api/systemGMT/summary'
export default {
  data () {
    return {
      arr: '',
      id: '',
      stfName: '',
      options: [], //员工
      dlz: '',
      time: '',
      jinData: [{ 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }],  // 今日内容
      selectlistRow: [],
      rowNum: 1,
      summaryObj: {
        title: '',
        ckStaffId: '',
        ReportContents: [],
        score: ''
      }
    }
  },
  components: {
  },
  mounted () {
    this.getUrlKey('id');
    this.getUrlKey('name');
    this.getdlz();
    this.getStaffs();
    this.getri();
  },
  methods: {
    //获取地址栏某个参数
    getUrlKey (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      if (name == 'id') {
        this.id = urlc;
      } else {
        this.stfName = urlc;
      }

    },
    async getri () {
      var jie = await SummarySv.getSummaryById(this.id);
      console.log(jie);
      this.summaryObj = jie.data;
      this.jinData = jie.data.reportContents;
    },
    async getdlz () { // 获取登录人的信息
      var jie = await SummarySv.getdlrInfo();
      console.log(jie);
      this.dlz = jie.data;
      this.time = jie.time;
    }, async getStaffs () {
      var jie = await NoticSv.getdmts();
      this.options = jie.data;
    },

    async onSubmit () {
      var jie = await SummarySv.pingScore(this.summaryObj);
      console.log(jie);
    },
    // 获取表格选中时的数据
    selectRow (val) {
      this.selectlistRow = val
    },
    // 增加行
    addRow () {
      var list = {
        rowNum: this.rowNum,
        post_id: [],
        require_des: '',
        remark: ''
      };
      this.jinData.unshift(list)
      this.rowNum += 1;
    },
    // 删除方法
    // 删除选中行
    delData () {
      for (let i = 0; i < this.selectlistRow.length; i++) {
        let val = this.selectlistRow
        // 获取选中行的索引的方法
        // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
        // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
        val.forEach((val, index) => {
          this.jinData.forEach((v, i) => {
            if (val.rowNum === v.rowNum) {
              // i 为选中的索引
              this.jinData.splice(i, 1)
            }
          })
        })
      }
      // 删除完数据之后清除勾选框
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style scoped>
table td {
  border: 1px solid #ccc;
  border-bottom: none;
  border-right: none;
}
.tdt {
  vertical-align: top;
  color: #909399;
  font-weight: 600;
  font-size: 15px;
  width: 200px;
  padding: 15px;
  text-align: right;
}
.tdc {
  vertical-align: top;
  color: #909399;
  width: 1000px;
  padding: 15px;
}
</style>