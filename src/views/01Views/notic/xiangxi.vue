<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0">
      <tr>
        <td class="tdt">标题</td>
        <td class="tdc">
          {{noticItm.noticName}}
        </td>
      </tr>
      <tr>
      <tr>
        <td class="tdt">公告类型</td>
        <td class="tdc">
          {{noticItm.nTyle}}
        </td>
      </tr>
      <tr>
        <td class="tdt">是否需要确认</td>
        <td class="tdc">
          {{noticItm.isQueren==null?"不需要确认":"需要确认"}}
        </td>
      </tr>
      <tr>
        <td class="tdt">内容</td>
        <td class="tdc">
          <div>
            <div style="display:none"
                 id="toolbar-container"
                 class="toolbar"></div>
            <div id="text-container"
                 class="text"></div>
          </div>
        </td>
      </tr>
      <tr :hidden='noticItm.isQueren==null'>
        <td class="tdt">未确认人员</td>
        <td class="tdc">
          <ul>
            <li v-for="itm in noticItm.ckNotic"
                :key="itm.id"
                :hidden="itm.cktime.length!=0">
              {{itm.ckStaffObj.department.name}} - {{itm.ckStaffObj.username}}
            </li>
          </ul>
        </td>
      </tr>
      <tr>
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
      nTypes: [],
      type: '',
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
    this.getType('type'); // 获取流程类型Id
    this.getStaffs();//获取全部员工
    this.getselctnotType();//获取公告类型

    const editor = new wangEditor('#toolbar-container', '#text-container')
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
    async getType (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      this.type = urlc;
    }
    //获取地址栏某个参数
    , async getUrlKey (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null

      var jie = await NoticSv.getxxNoticById(urlc);
      this.editor.txt.html(jie.data.content);
      this.noticItm = jie.data;
      console.log(jie.data);
    }
    , async getStaffs () {
      var jie = await NoticSv.getdmts();
      this.options = jie.data;
    }
    , async getselctnotType () {
      var jie = await NoticTypeSv.getSelectType();
      this.nTypes = jie.data;
    }
    , onSubmit () {
    }
  }
}
</script>

<style scoped>
table td {
  border: 1px solid #ccc;
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