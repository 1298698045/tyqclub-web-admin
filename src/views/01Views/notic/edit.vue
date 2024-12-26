<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0">
      <tr>
        <td class="tdt">标题</td>
        <td class="tdc">
          <el-input v-model="noticItm.noticName"></el-input>
        </td>
      </tr>
      <tr>
      <tr>
        <td class="tdt">公告类型</td>
        <td class="tdc">
          <el-select v-model="noticItm.nTypeId"
                     placeholder="请选择部门">
            <el-option v-for="itm in nTypes"
                       :key="itm.id"
                       :label="itm.name"
                       :value="itm.id"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
      <tr>
        <td class="tdt">接收人</td>
        <td class="tdc">
          <div style="width:100%">
            <el-cascader style="width:100%"
                         v-model="defaultSelect"
                         placeholder="试试搜索：指南"
                         :options="options"
                         node-key="label"
                         :props="{ multiple: true }"
                         size="medium"
                         filterable></el-cascader>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt">内容</td>
        <td class="tdc">
          <div id="demo1"></div>
        </td>
      </tr>
      <tr>
        <td class="tdt"
            colspan="2">
          <el-button @click="onSubmit">确定</el-button>

        </td>
      </tr>
    </table>

  </div>
</template>
<script>
import wangEditor from 'wangeditor'
import NoticSv from '@/api/systemGMT/notic'
import NoticTypeSv from '@/api/systemGMT/noticType'
export default {
  data () {
    return {
      queryNotic: {},
      defaultSelect: [],
      options: [], //员工
      nTypes: [],
      noticItm: {
        noticName: '',
        content: '',
        nTypeId: '',
        ckNotic: []
      }
    }
  },
  components: {
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  mounted () {
    this.getUrlKey('id'); // 获取流程类型Id
    this.getStaffs();//获取全部员工
    this.getselctnotType();//获取公告类型
    const editor = new wangEditor(`#demo1`)
    editor.config.zIndex = 1000
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
    //获取地址栏某个参数
    async getUrlKey (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      var jie = await NoticSv.getNoticById(urlc);
      this.noticItm = jie.data;
      console.log(jie.data);
      // 拿 要查看公告的人
      var ckarr = jie.data.ckNotic;
      var selectArr = [];
      for (var i = 0; i < ckarr.length; i++) {
        var bmid = ckarr[i]['ckStaffObj']['departmentId'];
        var stafid = ckarr[i]['ckStaffId'];
        selectArr.push([bmid, stafid]);
      }
      var newArr = [];
      selectArr.forEach(element => {
        newArr.push(element);
      });
      console.log(newArr);
      this.defaultSelect = newArr;
      this.editor.txt.html(jie.data.content);
    }
    , async getStaffs () {
      var jie = await NoticSv.getdmts();
      this.options = jie.data;
    }
    , async getselctnotType () {
      var jie = await NoticTypeSv.getSelectType();
      this.nTypes = jie.data;
    }
    , async onSubmit () {
      this.noticItm.ckNotic = [];
      this.noticItm.content = this.editor.txt.html();
      console.log(this.defaultSelect);
      for (var i = 0; i < this.defaultSelect.length; i++) {
        var sid = this.defaultSelect[i][1];
        var itmStaffId = { 'ckStaffId': sid };
        this.noticItm.ckNotic.push(itmStaffId);
      }
      //var newNotItm = { 'noticName': this.noticItm.noticName, 'content': this.noticItm.content, 'nTypeId': this.noticItm.nTypeId, 'ckNotic': this.noticItm.ckNotic }
      console.log(this.noticItm);
      var noticvl = JSON.stringify(this.noticItm)
      var jie = await NoticSv.updateNotics(JSON.parse(noticvl));
      console.log(jie);
      this.$notify({
        title: 'Success',
        message: "成功",
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.push({ path: '/tongzhi/notic/list' })
      }, 0.5 * 1000);
    }
  }
}
</script>

<style scoped>
table td {
  /* border: 1px solid #ccc; */
  border-bottom: none;
  border-right: none;
}
.tdt {
  vertical-align: top;
  color: #909399;
  font-weight: 600;
  font-size: 15px;
  width: 200px;
  padding: 15px;
  text-align: right;
}
.tdc {
  vertical-align: top;
  color: #909399;
  width: 1000px;
  padding: 15px;
}
</style>