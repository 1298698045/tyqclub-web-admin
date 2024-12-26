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
      <el-button :hidden="isShow"
                 :class="{'filter-item':true,'dsnone':isShow}"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves
                 :loading="downloadLoading"
                 :class="{'filter-item':true,'dsnone':isShow}"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer"
                   :class="{'filter-item':true,'dsnone':isShow}"
                   style="margin-left:15px;"
                   @change="tableKey=tableKey+1">
        审核人
      </el-checkbox>
    </div>
    <el-row :gutter="10">
      <el-col :span="18">
        <!-- 表格 -->
        <el-table :key="tableKey"
                  v-loading="listLoading"
                  :data="list"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                  @current-change="selectChanged">
        <el-table-column prop="index" label="序号" align="center" width="80" fixed>
                <template slot-scope="scope">
                    <span>{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</span>
                </template>
            </el-table-column>
          <el-table-column label="用户名"
                           min-width="100px">
            <template slot-scope="{row}">
              {{row.username}}
            </template>
          </el-table-column>
          <el-table-column label="邮箱"
                           min-width="100px">
            <template slot-scope="{row}">
              {{row.email}}
            </template>
          </el-table-column>
          <el-table-column label="所在部门"
                           width="100px"
                           align="center">
            <template slot-scope="{row}">
              <el-tag>
                <span class="link-type"
                      @click="handleUpdate(row)">{{row.dname}}
                </span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="200px"
                           class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary"
                         size="mini"
                         :class="{'dsnone':isShow}"
                         @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button v-if="row.status!='published'"
                         size="mini"
                         type="success"
                         :class="{'filter-item':true,'dsnone':!isShow}"
                         @click="$emit('selectStaff',row)">
                选中
              </el-button>

              <el-button :class="{'filter-item':true,'dsnone':isShow}"
                         v-if="row.status!='deleted'"
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

      </el-col>

      <!-- 角色菜单 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>角色设置</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text"
                       @click="setActions">设置</el-button>
          </div>
          <el-tree ref="tree"
                   node-key="id"
                   :props="props"
                   :data="menus"
                   show-checkbox
                   @check-change="handleCheckChange" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改 添加页面 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 80%; margin-left:80px;">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :hidden="dialogStatus==='create'?false:true"
                      label="登录名"
                      prop="loginName">
          <el-input v-model="temp.loginName" />
        </el-form-item>
        <el-form-item :hidden="dialogStatus==='create'?false:true"
                      label="密码"
                      prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item :hidden="dialogStatus==='create'?false:true"
                      label="确认密码"
                      prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="所在部门"
                      prop="dmtname">
          <el-input v-model="temp.dmtname" />
        </el-form-item>

        <el-form-item label="所在部门">
          <el-select v-model="temp.dmtname"
                     class="filter-item"
                     placeholder="Please select">
            <el-option v-for="item in dmtOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="username">
          <el-input v-model="temp.email" />
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
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

import StaffSv from '@/api/systemGMT/sysstaff'
import DepartmentSv from '@/api/systemGMT/department'
import SysRoleSv from '@/api/systemGMT/sysrole'
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
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    panBu: {
      default: ''
    }
  },
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
  data () {
    return {
      props: {
        label: 'title',
        isLeaf: 'leaf'
      },
      selectStaff: {},
      menus: [],
      tableKey: 0,
      list: null,//[{ 'id': 1, 'Tname': '小李', 'name': "李坤", 'Password': '123456', 'Email': '12@qq.com' }],
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        importance: undefined,
        condition: "",
        deparmentf: '',
        sort: true
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID升序', key: true }, { label: 'ID降序', key: false }],
      dmtOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        departmentId: '',
        remark: '',
        username: '',
        dmtname: '', // did
        isDelete: false,
        email: '',
        loginName: '',
        password: '',
        dname: ''
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
    this.getSelectDmt()
    //this.getList()
  },
  mounted () {
    this.getList()
    this.getAllActions()
  },
  methods: {
    async getSelectDmt () {
      var jie = await DepartmentSv.getSelectDmt();
      this.dmtOptions = jie.data;
    },
    async getList () {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000);
      this.listQuery.deparmentf = this.panBu;
      var jie = await StaffSv.getStaffs(this.listQuery);
      this.list = jie.data;
      this.total = jie.total;
    },
    // 所有角色
    async getAllActions () {
      // 所有节点
      var actions = await SysRoleSv.getAllRoles();
      console.log(actions.data);
      const roots = actions.data.filter(ele => {
        return ele.parentId === 0
      })
      roots.forEach(root => {
        this.setChildrenNodes(root, actions.data)
      })
      this.menus = roots
    },
    setChildrenNodes (node, actions) {
      node.children = []
      var children = actions.filter(ele => {
        return ele.parentId === node.id
      })
      children.forEach(e => {
        node.children.push(e)
        this.setChildrenNodes(e, actions)
      })
    },
    async setActions () {
      var roids = this.$refs.tree.getCheckedKeys() // 选中的id
      var staffId = this.selectStaff.id;
      var jie = await StaffSv.setRoles(staffId, roids);
      console.log(jie);
      this.$notify({
        title: 'Success',
        message: "设置成功",
        type: 'success',
        duration: 2000
      })
    },
    async selectChanged (row) {
      console.log(row);
      this.selectStaff = row;
      // 清空选择的节点
      this.$refs.tree.setCheckedKeys([])
      const ids = await StaffSv.getRoleByStaffId(row.id);
      var arrRole = ids.data;
      if (!arrRole)
        return;
      arrRole.forEach(element => {
        var node = this.$refs.tree.getNode(element)
        if (node.isLeaf) {
          this.$refs.tree.setChecked(node, true)
        }
      })
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
    handleCheckChange () {

    },
    handleCreate () {
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
          this.temp.departmentId = this.temp.dmtname;
          console.log(this.temp);
          var jie = await StaffSv.insertStaffs(this.temp);
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
          //const tempData = Object.assign({}, this.temp)
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

          this.temp.departmentId = this.temp.dmtname;
          var jie = await StaffSv.updateStaffs(this.temp);
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
      var jie = await StaffSv.deleteStaffs(row.id);
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
.dsnone {
  display: none;
}
</style>
