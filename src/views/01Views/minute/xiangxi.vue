<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0">
      <tr>
        <td colspan="2"
            style="text-align:center;">
          <h1>{{minuteItm.title}}</h1>
        </td>
      </tr>
      <tr>
      <tr>
        <td class="tdc"
            colspan="2">
          <div>
            <div style="display:none"
                 id="toolbar-container"
                 class="toolbar"></div>
            <div id="text-container"
                 class="text"></div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt"
            colspan="2">

          <el-button v-if="dq.cktime==''"
                     @click="onSubmit">确认</el-button>
          <el-button v-else>返回</el-button>

        </td>
      </tr>
    </table>

  </div>
</template>
<script>
import wangEditor from 'wangeditor'
import NoticSv from '@/api/systemGMT/notic'
import NoticTypeSv from '@/api/systemGMT/noticType'
import Minutesv from '@/api/systemGMT/minute'
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
      },
      minuteItm: {}
      , dq: ''
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
      var jie = await Minutesv.getminuteById(urlc);
      this.editor.txt.html(jie.data.content);
      this.minuteItm = jie.data;
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
    , async onSubmit () {
      var jie = await NoticSv.putShouDao(this.noticItm);
      this.$notify({
        title: 'Success',
        message: "已查看",
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.push({ path: '/tongzhi/notic/noticList' })
      }, 0.5 * 1000);
    }
  }
}
</script>

<style scoped>
table td {
  border: 1px solid #ccc;
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
  width: 1300px;
  padding: 15px;
}
</style>