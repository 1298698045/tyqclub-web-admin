<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container"
         style="padding:0px">

         
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
      <el-button :class="{'filter-item':true}"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit">
        添加
      </el-button>
      <el-button :class="{'filter-item':true}"
                 type="primary"
                 icon="el-icon-download">
        导出
      </el-button>
    </div>

    <el-table :data="rolesList"
              style="width: 100%;margin-top:30px;"
              border>
               <el-table-column prop="index" label="序号" align="center" width="80" fixed>
                <template slot-scope="scope">
                    <span>{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</span>
                </template>
            </el-table-column>
      <el-table-column align="center"
                       label="角色名称"
                       width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger"
                     size="small"
                     @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible"
               :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role"
               label-width="80px"
               label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name"
                    placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input v-model="role.description"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="Role Description" />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree"
                   :check-strictly="checkStrictly"
                   :data="routesData"
                   :props="defaultProps"
                   show-checkbox
                   node-key="path"
                   class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary"
                   @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- 页码 -->
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getRoles" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import ActionSv from '@/api/systemGMT/sysaction'
import RoleSv from '@/api/systemGMT/sysrole'
import Pagination from '@/components/Pagination'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  components: {
    Pagination
  },
  data () {
    return {
      total: 2,
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listQuery: {
        page: 1,
        limit: 2,
        importance: undefined,
        condition: "",
        deparmentf: '',
        sort: true
      },
    }
  },
  computed: {
    routesData () {
      return this.routes
    }
  },
  created () {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes () {
      const res = await ActionSv.getActions()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
      console.log(res.data);
      console.log('routers123');
    },
    async getRoles () {
      const res = await RoleSv.getRoles()
      this.rolesList = res.data
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes (routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        console.log(onlyOneShowingChild);
        console.log('onlyOneShowingChild');
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.name),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.name)
        }
        res.push(data)
      }
      console.log(res);
      console.log('res hh');
      return res
    },
    generateArr (routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole () {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree (routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole () {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      var keys = checkedKeys.concat(halfCheckedKeys);
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      var jie = await RoleSv.setAction(this.role.id, keys);
      console.log(jie);
      // if (isEdit) {
      //   await updateRole(this.role.key, this.role)
      //   for (let index = 0; index < this.rolesList.length; index++) {
      //     if (this.rolesList[index].key === this.role.key) {
      //       this.rolesList.splice(index, 1, Object.assign({}, this.role))
      //       break
      //     }
      //   }
      // } else {
      //   const { data } = await addRole(this.role)
      //   this.role.key = data.key
      //   this.rolesList.push(this.role)
      // }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild (children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
