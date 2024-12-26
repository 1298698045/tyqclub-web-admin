<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item" />

      <el-button class="filter-item"
                 type="primary"
                 style="margin-left: 20px;"
                 icon="el-icon-search">
        搜索
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit">
        添加
      </el-button>
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-download">
        导出
      </el-button>
      <el-checkbox class="filter-item"
                   style="margin-left:15px;">
        审核人
      </el-checkbox>
    </div>

    <el-table :data="tableData"
              style="width: 100%"
              row-key="id"
              border
              lazy
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

 <el-table-column prop="index" label="序号" align="center" width="80" fixed>
                <template slot-scope="scope">
                    <span>{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</span>
                </template>
            </el-table-column>

      <!-- <el-table-column prop="actionId"
                       label="ID"
                       width="120">
      </el-table-column> -->
      <el-table-column prop="title"
                       label="菜单名称"
                       width="150">
      </el-table-column>
      <el-table-column prop="url"
                       label="连接地址"
                       width="150">
      </el-table-column>
      <el-table-column prop="controlName"
                       label="控制器"
                       width="130">
      </el-table-column>
      <el-table-column prop="actionName"
                       label="方法"
                       width="130">
      </el-table-column>
      <el-table-column prop="method"
                       label="请求方式"
                       width="150">
      </el-table-column>
      <el-table-column prop="isMenu"
                       label="类型"
                       width="80">
        <template slot-scope="scope">
          {{ scope.row.isMenu?"菜单":"按钮" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleUpdate(row)"
                     >编辑</el-button>
          <el-button type="danger"
                     size="small">{{scope.row.isDelete?"启用":"禁用"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <!-- <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" /> -->


  </div>
</template>

<script>
import ActionSv from '@/api/systemGMT/sysaction'
export default {
  data () {
    return {
      list: [],
      tableData: [],
      listQuery: {
        page: 1,
        limit: 2,
        importance: undefined,
        condition: "",
        sort: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        title: '',
        url: '',
        controlName: '',
        actionName: '', // did
        method: '',
        isMenu: ''
      },
    }
  },
  
  mounted () {
    this.getaction()
  },
  methods: {
    async getaction () {
      var jie = await ActionSv.getTableActions();
      console.log(jie);
      this.tableData = jie.data;
    },
    async load (tree, treeNode, resolve) {
      console.log(tree.actionId);
      var jie = await ActionSv.getChildAction(tree.actionId);
      console.log(jie.data);
      setTimeout(() => {
        resolve(jie.data)
      }, 800)
    },
    async getchild () {

    }
  },
}
</script>

<style>
</style>