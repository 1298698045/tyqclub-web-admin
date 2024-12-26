<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance"
                 placeholder="部门"
                 clearable
                 style="width: 90px;margin-left: 5px;"
                 class="filter-item">
        <el-option v-for="item in importanceOptions"
                   :key="item"
                   :label="item"
                   :value="item" />
      </el-select>

      <el-date-picker v-model="listQuery.dtime"
                      type="month"
                      style="margin-left:5px ;"
                      class="filter-item"
                      placeholder="选择月">
      </el-date-picker>

      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 style="margin-left: 20px;"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
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
      <el-table-column label="发布人"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.staff.username}}
        </template>
      </el-table-column>
      <el-table-column label="部门"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.staff.department.name}}
        </template>
      </el-table-column>
      <el-table-column label="流程类型"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.procTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="总小时"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.ztian}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!='deleted'"
                     size="mini"
                     type="danger"
                     @click="handleCreate(row)">

            查看详细
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

    <!-- 修改页面 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               width="50%">
      <el-table :data="xxData"
                style="width: 100%">
        <el-table-column prop="stratTime"
                         label="日期"
                         width="180">
        </el-table-column>
        <el-table-column prop="exampleName"
                         label="流程名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="tianshu"
                         label="天数">
        </el-table-column>

        <el-table-column prop="duration"
                         label="小时">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <router-link :to="'/flow/processExample/xiangxi?id='+row.id">
              <el-button type="text"
                         style="color:#303133">&emsp;查看详细</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer"
           class="dialog-footer"
           style="margin-top:-40px;">
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="text-align:right;margin-top:20px">
        <el-button @click="dialogFormVisible = false">
          退出
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible"
               title="Reading statistics">
      <el-table :data="pvData"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column prop="key"
                         label="Channel" />
        <el-table-column prop="pv"
                         label="Pv" />
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

import TongjiSv from '@/api/systemGMT/tongji'
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
      xxData: [],
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
        limit: 2,
        condition: "",
        sort: true,
        dtime: ''
      },
      importanceOptions: [1, 2, 3],
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
      var jie = await TongjiSv.getJiaBan(this.listQuery);
      console.log(jie);
      this.list = jie.data;
    },
    async getQingJiaXX (row) {
      console.log(row);
      var jie = await TongjiSv.getJiaBanxx({ 'id': row.staffId, 'riqi': this.listQuery.dtime });
      console.log(jie);
      this.xxData = jie.data;
    },
    // 获取表格选中时的数据
    selectRow (val) {
      this.selectlistRow = val
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
    handleCreate (row) {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getQingJiaXX(row);
    },
    async createData () {



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

    },
    async handleDelete (row, index) {

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