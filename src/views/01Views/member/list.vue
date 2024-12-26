<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.condition" placeholder="标题" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" /> -->
      <!-- <el-button v-waves class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search"
        @click="handleFilter">
        搜索
      </el-button> -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- <el-form-item label="审批人">
          <el-input v-model="formInline.user" placeholder="审批人"></el-input>
        </el-form-item> -->
        <el-form-item label="" style="padding-right: 30px;">
          <el-input v-model="listQuery.search" placeholder="昵称/手机号" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <!-- <el-form-item label="会员等级" style="padding-right: 30px;">
          <el-select v-model="formInline.region" placeholder="会员等级">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员标签">
          <el-select v-model="formInline.region" placeholder="标签">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="注册时间" style="padding-right: 30px;">
          <div class="block">
            <el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="入会时间">
          <div class="block">
            <el-date-picker v-model="value3" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>
          </div>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
     
    </div>
    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" stripe fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
        <el-table-column label="编号" width="80px" align="center" type="index">
      </el-table-column>

      <el-table-column label="头像" width="50px" >
        <template slot-scope="{row}">
          <div v-if="row.avatarUrl">
            <el-avatar :src="row.avatarUrl"></el-avatar>
          </div>
           <div v-else>
            <el-avatar icon="el-icon-user-solid"></el-avatar>
          </div>

        </template>
      </el-table-column>

      <el-table-column label="昵称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="微信名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员等级" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50px" align="center">
        <template slot-scope="{row}">
            <span v-if=" row.gender === 1">女</span>
             <span v-else>男</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" min-width="70px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>

       <el-table-column label="联系电话" min-width="100px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>


      <el-table-column label="累计积分" min-width="70px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.totalPoints }}</span>
        </template>
      </el-table-column>

      <el-table-column label="累计消费" min-width="70px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.totalAmount }}</span>
        </template>
      </el-table-column>

      

      <el-table-column label="注册时间" min-width="100px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.createdOn }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上次登录时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->

          <el-button v-if="row.status != 'detail'" size="mini" type="success" @click="handleDetail(row, $index)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows"
      @pagination="getList" />





 <!-- <el-dialog width="100%" top="0px" style="margin:50px 100px"  :visible.sync="dialogDetail" v-if="dialogDetail">
 <MemberDetail :memberObj="selectMemberObj" />
 </el-dialog> -->
    <!-- 修改页面 -->
    <el-dialog :title="textMap[dialogStatus]" width="70%" top="30px" :visible.sync="dialogFormVisible">

      <el-row>
        <el-col :span="24">
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px"
            style="width: 90%; margin-left:50px;">

            <el-row>
              <el-col :span="24">
                <el-form-item label="头像:" prop="name">
                  <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :limit="3">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" style="width: 40%;">
                <el-form-item label="微信名称:" prop="name">
                  <el-input v-model="temp.userName" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left:50px;">
                <el-form-item label="昵称:" prop="name">
                  <el-input v-model="temp.nickName" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" style="width: 40%;">
                <el-form-item label="会员等级:" prop="name">
                  <el-input v-model="temp.memberLevelId" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left:50px;">
                <el-form-item label="邮件:" prop="name">
                  <el-input v-model="temp.email" />
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="12" style="width: 40%;">
                <el-form-item label="手机号:" prop="name">
                  <el-input v-model="temp.phoneNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left:50px;">
                <el-form-item label="性别:" prop="name">
                  <el-input v-model="temp.gender" />
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="12" style="width: 40%;">
                <el-form-item label="出生日期:" prop="name">
                  <el-input v-model="temp.birthDate" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left:50px;">
                <el-form-item label="身份证号码:" prop="name">
                  <el-input v-model="temp.idNumber" />
                </el-form-item>
              </el-col>
            </el-row>



            <el-row>
              <el-col :span="12" style="width: 40%;">
                <el-form-item label="注册时间:" prop="name">
                  <el-input v-model="temp.registerTime" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left:50px;">
                <el-form-item label="成为会员时间:" prop="name">
                  <el-input v-model="temp.leavelRegisterTime" />
                </el-form-item>
              </el-col>
            </el-row>



            <el-row>
              <el-col :span="24">
                <el-form-item label="常住地址:" prop="name">
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="temp.address" />
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="24">
                <el-form-item label="兴趣爱好:" prop="name">
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="temp.hobby" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :hidden='!setStaff' label="当前管理" prop="username">
              <el-input v-model="temp.username" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>



      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          退出
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

import MemberSv from '@/api/systemGMT/member'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import MemberDetail from '@/views/01Views/member/memberDetail'
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
  components: { Pagination,MemberDetail },
  directives: { waves },
  
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      selectMemberObj:null,
     ue1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: '',
      value3: '',
      tableKey: 0,
      list: null,//[{ 'id': 1, 'Tname': '小李', 'name': "李坤", 'Password': '123456', 'Email': '12@qq.com' }],
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        search: null,
        phoneNumber: null,
        sort: true
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID升序', key: true }, { label: 'ID降序', key: false }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: '',
        userName: '',
        nickName: '',
        wechatKey: '',
        wechatOpenid: '',
        email: '',
        phoneNumber: '',
        registerTime: '',
        lastLoginTime: '',
        avatarUrl: '',
        gender: '',
        birthDate: '',
        address: '',
        idNumber: '',
        hobby: '',
        age: '',
        signature: '',
        totalPoints: '',
        memberLevelId: '',
        levelName: '',
        leavelRegisterTime: '',
        leavelRegisterTime: '',
        invitationCode: '',
        invitee: '',
      },
      dialogDetail:false,
      dialogDetailRow:null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑人员信息',
        create: '创建人员信息'
      },
      setStaff: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      formInline: {
        user: '',
        region: ''
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000);
      var jie = await MemberSv.getPageList(this.listQuery);
      this.list = jie.data;
      this.total = jie.total;
    },
    getSelectStaff(row) {
      console.log(row);
      this.temp.checkStaffId = row.id;
      this.temp.username = row.username;
      console.log(this.temp);
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          console.log(this.temp);
          var jie = await DepartmentSv.insertDepartment(this.temp);
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
    handleUpdate(row, setsf) {
      if (setsf) {
        this.setStaff = true;
      } else {
        this.setStaff = false;
      }
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData);
          var jie = await DepartmentSv.updateDepartment(tempData);
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
    async handleDetail(row, index) {
      this.dialogDetail = true;
      this.selectMemberObj = row;
      this.$router.push({ path: '/memberDetail',  query: {
               queryParam: row
             }});
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
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
    formatJson(filterVal) {
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
