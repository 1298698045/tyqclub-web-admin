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
          <el-input v-model="summaryObj.title" />
        </td>
        <td class="tdt">时间</td>
        <td class="tdt"
            style="width:500px;text-align:center;">{{time}}</td>
      </tr>
      <tr>
        <td class="tdt">发起人</td>
        <td class="tdt"
            style="width:500px;text-align:center;">{{dlz.dlrName}}</td>
        <td class="tdt">接收人</td>
        <td class="tdt"
            style="width:500px;text-align:center;">
          <div>
            <el-cascader style="width:100%"
                         v-model="arr"
                         placeholder="点击此处进行搜索"
                         :options="options"
                         :props="{ multiple: false }"
                         size="medium"
                         filterable></el-cascader>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt">今日内容</td>
        <td colspan="3"
            style="padding:20px 0 20px 40px">
          <div class="tableDate">
            <div class="button"
                 style="width:6%;float:right;">
              <P>
                <el-button class="el-icon-plus"
                           @click.prevent="addRow()"></el-button>
              </P>
              <p>
                <el-button class="el-icon-minus"
                           @click.prevent="delData()"></el-button>
              </p>
            </div>
            <div class="table">
              <el-table :data="jinData"
                        ref="table"
                        tooltip-effect="dark"
                        border
                        stripe
                        style="width: 93%"
                        @selection-change='selectRow'>
                <el-table-column type="selection"
                                 width="45"
                                 align="center"></el-table-column>
                <el-table-column label="序号"
                                 type="index"
                                 width="60"
                                 align="center"></el-table-column>
                <el-table-column label="内容"
                                 align="center">
                  <template slot-scope="scope">
                    <el-input type="textarea"
                              class="remark"
                              v-model="scope.row.content"></el-input>
                  </template>

                </el-table-column>
                <el-table-column label="完成情况">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.state"
                               placeholder="请选择任务状态">
                      <el-option label="准备中"
                                 value="0"></el-option>
                      <el-option label="进行中"
                                 value="1"></el-option>
                      <el-option label="已结束"
                                 value="2"></el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column label="工时">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.cTime"></el-input>
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt">结束</td>
        <td colspan="3">
          <el-button @click="onSubmit">确定</el-button>
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
      options: [], //员工
      dlz: '',
      time: '',
      jinData: [{ 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }, { 'content': '', 'state': '', 'cTime': '' }],  // 今日内容
      selectlistRow: [],
      rowNum: 1,
      summaryObj: {
        title: '',
        ckStaffId: '',
        ReportContents: []
      }
    }
  },
  components: {
  },
  mounted () {
    this.getdlz();
    this.getStaffs();
  },
  methods: {
    //获取地址栏某个参数
    getUrlKey (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
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
      console.log(this.arr);
      this.summaryObj.ckStaffId = this.arr[1];
      this.jinData.forEach((itm, index) => {
        if (itm.content) {
          this.summaryObj.ReportContents.push(itm);
        }
      })
      console.log(this.summaryObj);
      var stringObj = JSON.stringify(this.summaryObj);
      SummarySv.insertSummary(stringObj);
      this.$notify({
        title: 'Success',
        message: "提交成功",
        type: 'success',
        duration: 2000
      })

      this.$router.push('/jihua/summary/ri')

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