<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0">
      <tr>
        <td class="tdt"
            colspan="2">
          <h1 style="text-align:center">{{processtype.processName}}</h1>
        </td>
      </tr>
      <tr>
        <td class="tdt">发起流程</td>
        <td class="tdc">{{processtype.processName}}</td>
      </tr>

      <tr>
        <td class="tdt">流程名称</td>
        <td class="tdc">
          {{processExample.exampleName}}
        </td>
      </tr>
      <tr>
        <td class="tdt">紧急程度</td>
        <td class="tdc">
          {{processExample.leve == 0?"一般":"紧急"}}

        </td>
      </tr>
      <tr>
        <td class="tdt">流程时间</td>
        <td class="tdc">
          {{processExample.stratTime}} 至 {{processExample.endTime}}
          每天{{processExample.duration}}小时
        </td>
      </tr>
      <tr>
        <td class="tdt">当前审核人</td>
        <td class="tdc">
          {{bmName}} - {{dangqCkren.username}}
        </td>
      </tr>
      <tr>
        <td class="tdt">备注</td>
        <td class="tdc">
          {{processExample.remarks}}
        </td>
      </tr>
      <tr>
        <td class="tdt">流程描述</td>
        <td class="tdc">
          <div style="padding-bottom:10px">
            <el-tag :type="lableType"
                    v-if="liuc[0]">{{liuc[0]}}</el-tag>
          </div>
          <el-tag :type="lableType2"
                  v-if="liuc[1]">{{liuc[1]}}</el-tag>
        </td>

      </tr>
      <tr>
        <td class="tdt">流程表单</td>
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
      <tr>
        <td class="tdt">审核情况</td>
        <td class="tdc">
          <!-- 审核情况--------------------  -->
          <div>
            <el-timeline style="padding:0px">
              <el-timeline-item v-for="(itm,index) in processsteps"
                                :key="index"
                                :timestamp="itm.state==0?'':itm.checkTime"
                                placement="top">
                <el-card>
                  <h4>{{itm['checkStaff']['department']['name']}} —— {{itm['checkStaff']['username']}},{{itm.state==0?"正在审核":itm.state==1?"通过":"驳回"}}申请</h4>
                  <p :hidden="itm.state==0">意见:{{itm.opinion}}</p>
                  <p :hidden="itm.state==0"
                     style="padding-top:10px"> 审核时间:{{itm.checkTime}},结果:<span style="font-size:14px;color:red;">{{itm.state==1?"通过":"驳回"}}</span></p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </td>
      </tr>
      <tr>
        <td class="tdt"
            colspan="2">
          <el-button @click="onSubmit">返回</el-button>

        </td>
      </tr>
    </table>
    <!-- ---------------------- -->

  </div>
</template>

<script>

import wangEditor from 'wangeditor'

import DepartmentSv from '@/api/systemGMT/department'
import StaffSv from '@/api/systemGMT/sysstaff'
import processExampleSv from '@/api/systemGMT/processExample'
export default {
  data () {
    return {
      liuc: [],
      lableType: 'info',
      lableType2: 'info',
      bmName: '',
      dangqCkren: { 'username': '123' },
      processtype: { 'processName': '', 'processDescribe': '' },
      processsteps: [],
      checkbumen: '',
      processExampleId: '',
      processExample: {},
      datalist: [{ name: '123' }],
      example: {
        exampleName: '123',
        procTypeId: '',
        content: '',
        leve: "0",
        remarks: '',
        currentCheckStaffId: ''
      },
      selectDmt: [],
      selectDmtStaff: []
    }
  },
  watch: {
    checkbumen (xv, jv) {
      this.getSelectStaffByBumenId(xv);
    }
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  mounted () {
    this.getUrlKey('id'); // 获取流程类型Id
    this.getProcessExampleSteps(); // 获取流程实例对象
    this.getSelectDeparments();//获取所有部门
    this.getlicu();
    const editor = new wangEditor('#toolbar-container', '#text-container')
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
    //发起流程
    async onSubmit () {
      this.example.content = this.editor.txt.html();
      var jie = await processExampleSv.insertProcessExample(this.example);
      console.log(jie);
      console.log(this.example);
    }
    , getlicu () {
      setTimeout(() => {
        var sarr = this.processtype.processDescribe.split(',');
        console.log(sarr);
        this.liuc = sarr;


      }, 1500);
    }
    //获取所有部门
    , async getSelectDeparments () {
      var jie = await DepartmentSv.getSelectDmt();
      this.selectDmt = jie.data;

    }
    //获取部门下的人员
    , async getSelectStaffByBumenId (bid) {
      this.example.currentCheckStaffId = '';
      var jie = await StaffSv.getdmtStaff(bid);
      this.selectDmtStaff = jie.data;
      console.log(jie);
    }
    //获取地址栏某个参数
    , getUrlKey (name) {
      var urlc = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      this.processExampleId = urlc;
    }
    , async getProcessExampleSteps () {
      var jie = await processExampleSv.getporcessExamAndSteps(this.processExampleId);
      console.log(jie);
      this.processExample = jie.data;
      this.editor.txt.html(this.processExample.content);
      this.processtype = jie.data.procType;
      this.processsteps = jie.data.processSteps;
      var stps = this.processsteps;
      var ckren = stps.find((itm, index) => {
        if (itm.state == 0 && itm.checkStaffId == this.processExample.currentCheckStaffId) {
          return itm;
        }
        return null;
      });
      if (ckren) {
        this.dangqCkren = ckren.checkStaff;
        this.dangqCkbumen = ckren.checkStaff.department
      }
      if (jie.tian <= 2) {
        this.lableType = 'warning';
      } else {
        this.lableType2 = 'warning';
      }



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
  color: #909399;
  font-weight: 600;
  font-size: 15px;
  width: 200px;
  padding: 15px;
  text-align: right;
}
.tdc {
  color: #909399;
  width: 1000px;
  padding: 15px;
}
.w-e-toolbar {
  display: none;
}
</style>