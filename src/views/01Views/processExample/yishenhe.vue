<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <!--  -->
      <el-button class="filter-item"
                 type="primary"
                 style="margin-left: 20px;"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-download">
        导出
      </el-button>
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
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="200px"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人"
                       width="100px">
        <template slot-scope="{row}">
          {{row.username}}
        </template>
      </el-table-column>
      <el-table-column label="流程名称"
                       width="200px">
        <template slot-scope="{row}">
          {{row.exampleName}}
        </template>
      </el-table-column>
      <el-table-column label="流程类型"
                       width="200px">
        <template slot-scope="{row}">
          {{row.processName}}
        </template>
      </el-table-column>
      <el-table-column label="当前状态"
                       width="200px">
        <template slot-scope="{row}">
          {{row.state}}
        </template>
      </el-table-column>

      <el-table-column label="Actions"
                       align="center"
                       min-width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/flow/processExample/xiangxi?id='+row.id">
            <el-button type="text">详细&emsp;</el-button>
          </router-link>
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
import Pagination from '@/components/Pagination'
import processExampleSv from '@/api/systemGMT/processExample'
export default {
  components: { Pagination },
  data () {
    return {
      total: 2,
      list: [],
      listLoading: true,
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        condition: "",
        sort: true
      },
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000);
      var jie = await processExampleSv.getshenheguo(this.listQuery);
      this.list = jie.data;
      console.log(jie);
    },
    handleFilter () {
      this.listQuery.page = 1
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  },

}
</script>

<style>
</style>