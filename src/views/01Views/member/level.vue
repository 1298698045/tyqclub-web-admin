<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="" style="padding-right: 30px">
          <el-input
            v-model="listQuery.search"
            placeholder="等级名称"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="handleCreate"
          >
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        width="80"
        fixed
      >
        <template slot-scope="scope">
          <span>{{
            scope.$index + (listQuery.page - 1) * listQuery.rows + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级名称" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model="row.name"
            size="small"
            v-if="updateWhere"
          ></el-input>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所需消费金额" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model="row.minAmount"
            type="number"
            size="small"
            v-if="updateWhere"
          ></el-input>
          <span v-else>{{ row.minAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所需报名次数" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.minSignUp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.discountRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.giftPoints }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认等级" min-width="50px" align="center">
        <template slot-scope="{ row }">
          <input
            type="checkbox"
            id="reading"
            value="reading"
            v-model="row.isDefault"
            @click="levelDefault(row)"
            :disabled="row.isDefault"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="等级描述"
        min-width="70px"
        align="center"
        sortable
      >
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拥有人数"
        min-width="70px"
        align="center"
        sortable
      >
        <template slot-scope="{ row }">
          <span>{{ row.memberCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        min-width="70px"
        align="center"
        sortable
      >
        <template slot-scope="{ row }">
          <span>{{ row.createdOn }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ updateTitle }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.rows"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="24">
          <el-form
            ref="dataForm"
            :model="temp"
            label-position="left"
            label-width="110px"
            style="width: 90%; margin-left: 50px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="等级名称:">
                  <el-input v-model="temp.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" style="width: 40%">
                <el-form-item label="所需消费金额:">
                  <el-input type="number" v-model="temp.minAmount" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left: 50px">
                <el-form-item label="所需报名次数:">
                  <el-input type="number" v-model="temp.minSignUp" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" style="width: 40%">
                <el-form-item label="享受折扣:">
                  <el-input type="number" v-model="temp.discountRatio" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="width: 50%; margin-left: 50px">
                <el-form-item label="赠送积分:">
                  <el-input type="number" v-model="temp.giftPoints" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-col :span="24">
              <el-form-item label="描述:">
                <el-input
                  rows="10"
                  type="textarea"
                  v-model="temp.description"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 退出 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
} from "@/api/article";

import MemberLevelSv from "@/api/systemGMT/memberLevel";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      updateWhere: false,
      updateTitle: "编辑",
      tableKey: 0,
      list: null,
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        search: null,
        phoneNumber: null,
        sort: true,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: "",
        name: "",
        description: "",
        minAmount: "",
        isDefault: "",
        minSignUp: "",
        memberCount: "",
        createdOn: "",
        discountRatio: "",
        giftPoints: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑会员等级",
        create: "创建会员等级",
      },
      setStaff: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      formInline: {
        user: "",
        region: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.5 * 1000);
      var jie = await MemberLevelSv.getPageList(this.listQuery);
      this.list = jie.data;
      this.total = jie.total;
    },
    async levelDefault(row) {
      this.list.forEach((obj) => {
        obj.isDefault = false;
      });
      row.isDefault = true;
      var jie = await MemberLevelSv.updateDefault(row.id);
      if (jie.code == 20000) {
        this.$notify({
          title: "Success",
          message: jie.message,
          type: "success",
          duration: 2000,
        });
      }
    },
    getSelectStaff(row) {
      console.log(row);
      this.temp.checkStaffId = row.id;
      this.temp.username = row.username;
      console.log(this.temp);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    async createData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          console.log(this.temp);
          var jie = await MemberLevelSv.insertLevel(this.temp);
          if (jie.code == 20000) {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: jie.message,
              type: "success",
              duration: 2000,
            });
          }
        }
      });
    },
    handleUpdate(row, setsf) {
      if (setsf) {
        this.setStaff = true;
      } else {
        this.setStaff = false;
      }
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    async updateData(row) {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          var jie = await MemberLevelSv.updateLevel(this.temp);
          if (jie.code == 20000) {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: jie.message,
              type: "success",
              duration: 2000,
            });
          }
        }
      });
    },
    async updateData2() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData);
          console.log("疯狗");
          var jie = await DepartmentSv.updateDepartment(tempData);
          if (jie.code == 20000) {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: jie.message,
              type: "success",
              duration: 2000,
            });
          }
        }
      });
    },
    async handleDelete(row, index) {
      var jie = await DepartmentSv.deleteDepartment(row.id);
      if (jie.code == 20000) {
        this.$notify({
          title: "Success",
          message: jie.message,
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      }
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
