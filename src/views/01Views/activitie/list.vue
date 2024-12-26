<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container"></div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="" style="padding-right: 30px">
        <el-input
          t
          v-model="listQuery.name"
          placeholder="活动名称"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <div class="block">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            placeholder="选择日期范围"
          ></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="selectedValue" style="padding-right: 20px">
          <el-option value="-1" label="全部" />
          <el-option value="0" label="草稿" />
          <el-option value="1" label="已发布" />
          <el-option value="2" label="已结束" />
          <el-option value="3" label="已取消" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">搜索</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column label="编号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column label="展示图" prop="pictures" min-width="100px">
        <template slot-scope="{ row }">
          <el-image
            v-if="row.pictures && row.pictures[0]"
            style="width: 100px; height: 100px"
            :src="imgAddress + row.pictures[0].fileLocation"
            fit="contain"
          ></el-image>
          <!-- <span   v-if="row.pictures && row.pictures[0]">{{imgAddress+row.pictures[0].fileLocation}}</span> -->

          <el-image v-else fit="contain" style="width: 100px; height: 100px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="活动名"
        prop="name"
        min-width="100px"
        :class-name="getSortClass('name')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织人" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.leader }}
        </template>
      </el-table-column>

      <el-table-column label="分类" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.itemCategoryName }}
        </template>
      </el-table-column>

      <el-table-column label="开始日期" min-width="100px">
        <template slot-scope="{ row }">
          {{ row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="结束日期" min-width="100px">
        <template slot-scope="{ row }">
          {{ row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="当前人数" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.currentStudents }}
        </template>
      </el-table-column>
      <el-table-column label="限制人数" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.currentStudents }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70px">
        <template slot-scope="{ row }">
          {{ row.stateCodeName }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="handleCreate(row)">
            再次发起
          </el-button>
           <el-button v-if="row.status != 'detail'" size="mini" type="success" @click="handleDetail(row, $index)">
            查看详情
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

    <!-- 修改页面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 80%; margin-left: 80px"
      >
        <el-form-item label="新闻标题" prop="name">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容" prop="name"> </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -40px">
        <div id="demo1"></div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: right; margin-top: 20px"
      >
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
      <el-table :data="pvData" fit highlight-current-row style="width: 100%">
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

import wangEditor from "wangeditor";
import ActivitieSv from "@/api/systemGMT/activitie";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  {
    key: "CN",
    display_name: "China",
  },
  {
    key: "US",
    display_name: "USA",
  },
  {
    key: "JP",
    display_name: "Japan",
  },
  {
    key: "EU",
    display_name: "Eurozone",
  },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
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
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
  mounted() {
    const editor = new wangEditor(`#demo1`);
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml;
    };
    // 创建编辑器
    editor.create();
    editor.txt.html(this.opContent); // 设置内容
    this.editor = editor;
  },
  data() {
    return {
      imgAddress: "http://47.96.15.8:9006",
      selectObj: null,
      dateRange: [],
      selectedValue: null,
      value1: "",
      tableKey: 0,
      list: null,
      total: 2,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        name: null,
        phoneNumber: null,
        sort: false,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: "",
        title: "",
        content: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      setStaff: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          {
            required: true,
            message: "type is required",
            trigger: "change",
          },
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
          {
            required: true,
            message: "title is required",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
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
      var jie = await ActivitieSv.getPageList(this.listQuery);
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
      this.listQuery.page = 1;
      if (this.dateRange || this.dateRange.length) {
        this.listQuery.startTime = this.dateRange[0];
        this.listQuery.endTime = this.dateRange[1];
      }

      if (this.selectedValue) {
        this.listQuery.stateCode = this.selectedValue;
      }

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
    resetTemp() {},
    handleUpdate(row, setsf) {
      row.mode = 2;
      if (row.stateCode == 1) {
        // 已发布的不可编辑
        row.mode = 3;
      }
      this.selectObj = row;
      this.$router.push({
        path: "/activitie/push",
        query: {
          queryParam: row,
        },
      });
    },
    handleCreate(row, setsf) {
      row.id = this.guid();
      row.mode = 1;
      row.startTime = null;
      row.endTime = null;
      row.cancelTime = null;
      if (row.activitiePictures) {
        row.activitiePictures.forEach((picture) => {
          (picture.objectTypeId = null), (picture.id = this.guid());
        });
      }
      this.selectObj = row;
      this.$router.push({
        path: "/activitie/push",
        query: {
          queryParam: row,
        },
      });
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
     async handleDetail(row, index) {
      this.dialogDetail = true;
      this.selectMemberObj = row;
      this.$router.push({ path: '/activitieDetail',  query: {
               queryParam: row
             }});
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
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
<style scoped>
.dialog-footer {
  text-align: left;
}
</style>