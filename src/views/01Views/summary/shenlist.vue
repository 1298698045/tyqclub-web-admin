<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.summType"
                 placeholder="报告类型"
                 clearable
                 style="width: 90px;margin-left: 5px;"
                 class="filter-item">
        <el-option v-for="item in importanceOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id" />
      </el-select>
      <el-date-picker v-model="listQuery.dtime"
                      type="date"
                      style="margin-left: 5px;"
                      placeholder="选择日期">
      </el-date-picker>

      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 style="margin-left: 20px;"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit">
        <router-link :to="'/jihua/summary/addri'">
          添加
        </router-link>
      </el-button>
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer"
                   class="filter-item"
                   style="margin-left:15px;"
                   @change="tableKey=tableKey+1">
        审核人
      </el-checkbox>
    </div>
    <!-- 表格 -->
    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange">
      <el-table-column label="编号"
                       width="150px"
                       align="center"
                       type="index">
      </el-table-column>

      <el-table-column label="标题"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.title}}
        </template>
      </el-table-column>

      <el-table-column label="发布人"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.sysStaff.username}}
        </template>
      </el-table-column>
      <el-table-column label="报告类型"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.sumType.typeName}}
        </template>
      </el-table-column>
      <el-table-column label="发布时间"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.time}}
        </template>
      </el-table-column>
      <el-table-column label="Actions"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'"
                     size="mini"
                     type="danger">
            <router-link :to="'/jihua/summary/shenxiangxi?id='+row.id+'&name='+row.sysStaff.username">
              查看
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

import wangEditor from 'wangeditor'
import DepartmentSv from '@/api/systemGMT/department'
import MinuteSv from '@/api/systemGMT/minute'
import SummarySv from '@/api/systemGMT/summary'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter (type) {
      return calendarTypeKeyValue[type]
    }
  },
  mounted () {

  },
  data () {
    return {
      tableData: [], // 今天表格数据
      mrData: [], // 明日表格数据
      selectlistRow: [],
      rowNum: 1,
      dlr: '',
      riqi: '',
      tableKey: 0,
      list: null,
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        summType: '',
        limit: 2,
        condition: "",
        sort: true,
        dtime: ''
      },
      importanceOptions: [{ "name": "日报", "id": "77110000-0000-0000-0000-000000000000" }, { "name": "月报", "id": "77110000-0000-0000-0000-000000000002" }, { "name": "年报", "id": "77110000-0000-0000-0000-000000000004" }],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID升序', key: true }, { label: 'ID降序', key: false }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        //id: '',
        title: '',
        //ckStaffId: '', // 上级id
        ReportContents: [{ 'content': '内容', 'state': 1, 'typeId': 0 }],

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000);
      var jie = await SummarySv.getShenSummarys(JSON.stringify(this.listQuery));
      console.log(jie);
      this.list = jie.data;
      this.total = jie.total;
      this.dlr = jie.dlr;
      this.riqi = jie.riqi;
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
      this.tableData.unshift(list)
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
          this.tableData.forEach((v, i) => {
            if (val.rowNum === v.rowNum) {
              // i 为选中的索引
              this.tableData.splice(i, 1)
            }
          })
        })
      }
      // 删除完数据之后清除勾选框
      this.$refs.table.clearSelection()
    },











    getSelectStaff (row) {
      console.log(row);
      this.temp.checkStaffId = row.id;
      this.temp.username = row.username;
      console.log(this.temp);
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp () {

    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          console.log(this.temp);
          var newTemp = JSON.stringify(this.temp);
          var jie = await SummarySv.insertSummary(newTemp);
          if (jie.code == 20000) {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: jie.message,
              type: 'success',
              duration: 2000
            })
          }

        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp);
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData);
          var jie = await MinuteSv.updateMinute(tempData);
          if (jie.code == 20000) {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: jie.message,
              type: 'success',
              duration: 2000
            })
          }

        }
      })
    },
    async handleDelete (row, index) {
      var jie = await DepartmentSv.deleteDepartment(row.id);
      if (jie.code == 20000) {
        this.$notify({
          title: 'Success',
          message: jie.message,
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      }

    },
    handleFetchPv (pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style scoped>
.dialog-footer {
  text-align: left;
}
.el-dialog {
  width: 80% !important;
}

.tb-edit .input-box {
  display: none;
}
.tb-edit .current-cell .input-box {
  display: block;
  margin-left: -15px;
}
</style>