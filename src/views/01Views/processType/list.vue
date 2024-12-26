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
      <el-table-column label="序号"
                       width="100px"
                       type="index">

      </el-table-column>
      <el-table-column label="名称"
                       width="150px">
        <template slot-scope="{row}">
          {{row.processName}}
        </template>
      </el-table-column>
      <el-table-column label="描述"
                       min-width="250px"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.processDescribe }}</span>
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
          <el-button v-if="row.status!='published'"
                     size="mini"
                     type="success"
                     @click="handleModifyStatus(row,'published')">
            发布
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
    <!-- 添加页面 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">

      <el-form ref="dataForm"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 80%; margin-left:40px;">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="temp.processName" />
        </el-form-item>
        <el-form-item label="流程">
          <el-input v-model="temp.processDescribe"
                    :autosize="{ minRows: 7, maxRows: 8}"
                    type="textarea"
                    placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div class="bta">表单设计</div>
      <div slot="footer"
           style="margin-left:108px;margin-top: -35px;text-align: left;">

        <div id="demo1"></div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="text-align: right;">

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
import ProcessTypeSv from '@/api/systemGMT/processType'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import StaffList from '@/views/01Views/sysstaff/list'
import WenBen from './wenBen'
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
  components: { Pagination, StaffList, WenBen },
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
  data () {
    return {
      editor: null,
      editorData: '',
      drawer: false,
      direction: 'ttb',
      tableKey: 0,
      list: null,//[{ 'id': 1, 'Tname': '小李', 'name': "李坤", 'Password': '123456', 'Email': '12@qq.com' }],
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
        remark: '',
        name: '',
        tel: '',
        checkStaffId: '',
        username: '',
        fromContent: ''
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
  methods: {
    async getList () {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000);
      var jie = await ProcessTypeSv.getProcessTypes(this.listQuery);
      this.list = jie.data;
      this.total = jie.total;
    },
    getEditorData () {
      // 通过代码获取编辑器内容
      let data = this.editor.txt.text()
      alert(data)
    },
    updateYe (row) {
      this.temp = row;
      console.log(row);
      this.drawer = true;
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
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
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
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate () {

      this.editor.txt.html('')
      this.temp.fromContent = '';
      this.resetTemp()
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
          this.temp.fromContent = this.editor.txt.html();
          var jie = await ProcessTypeSv.insertProcessType(this.temp);
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
      if (row.fromContent)
        this.editor.txt.html(row.fromContent)
      else
        this.editor.txt.html('')
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          var str = this.editor.txt.html();
          this.temp.fromContent = str;
          const tempData = Object.assign({}, this.temp)
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData);
          var jie = await ProcessTypeSv.updateProcessType(tempData);
          if (jie.code == 20000) {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.drawer = false
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
.bta {
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  font-weight: bold;
  width: 80px;
  text-align: right;
}
</style>