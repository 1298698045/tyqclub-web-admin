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
                 placeholder="重要性"
                 clearable
                 style="width: 90px;margin-left: 5px;"
                 class="filter-item">
        <el-option v-for="item in importanceOptions"
                   :key="item"
                   :label="item"
                   :value="item" />
      </el-select>

      <el-select v-model="listQuery.sort"
                 style="width: 140px;margin-left: 5px;"
                 class="filter-item"
                 @change="handleFilter">
        <el-option v-for="item in sortOptions"
                   :key="item.key"
                   :label="item.label"
                   :value="item.key" />
      </el-select>
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
                 icon="el-icon-edit"
                 @click="handleCreate">
        添加
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
      <el-table-column label="序号"
                       prop="id"
                       sortable="custom"
                       align="center"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新闻标题"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.title}}
        </template>
      </el-table-column>
      <el-table-column label="发布人"
                       min-width="150px">
        <template slot-scope="{row}">
          {{row.username}}
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
        <template slot-scope="{row,$index}">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'"
                     size="mini"
                     type="danger"
                     @click="handleDelete(row,$index)">
            删除
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
               :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 80%; margin-left:80px;">
        <el-form-item label="新闻标题"
                      prop="name">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容"
                      prop="name">

        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="margin-top:-40px;">
        <div id="demo1"></div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="text-align:right;margin-top:20px">
        <el-button @click="dialogFormVisible = false">
          退出
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createData():updateData()">
          确认
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

import wangEditor from 'wangeditor'
import DepartmentSv from '@/api/systemGMT/department'
import MinuteSv from '@/api/systemGMT/minute'
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
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  mounted () {
    const editor = new wangEditor(`#demo1`)
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
    }
    // 创建编辑器
    editor.create()
    editor.txt.html(this.opContent);// 设置内容
    this.editor = editor
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 2,
        importance: undefined,
        condition: "",
        sort: true
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID升序', key: true }, { label: 'ID降序', key: false }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: '',
        title: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      setStaff: false,
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
      var jie = await MinuteSv.getMinutes(this.listQuery);
      this.list = jie.data;
      this.total = jie.total;
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
      this.editor.txt.html('');
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.temp.content = this.editor.txt.html();
          console.log(this.temp);
          var jie = await MinuteSv.insertMinute(this.temp);
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
    handleUpdate (row, setsf) {
      if (setsf) {
        this.setStaff = true;
      } else {
        this.setStaff = false;
      }
      this.temp.content = row.content
      this.editor.txt.html(this.temp.content)
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
</style>