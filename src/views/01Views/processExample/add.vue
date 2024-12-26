<template>
  <div class="app-container">
    <table cellspacing="0"
           cellpadding="0">
      <tr>
        <td class="tdt"
            colspan="2">
          <h1 style="text-align:center">{{processType.processName}}</h1>
        </td>
      </tr>
      <tr>
        <td class="tdt">发起流程</td>
        <td class="tdc">{{processType.processName}}</td>
      </tr>

      <tr>
        <td class="tdt">流程名称</td>
        <td class="tdc">
          <!-- v-model="123" -->
          <el-input v-model="example.exampleName"></el-input>
        </td>
      </tr>
      <tr>
        <td class="tdt">紧急程度</td>
        <td class="tdc">
          <!-- v-model="form.region" -->
          <el-select v-model="example.leve"
                     placeholder="请选择部门">
            <el-option label="一般"
                       value="0"></el-option>
            <el-option label="紧急"
                       value="1"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="tdt">申请时间</td>
        <td class="tdc">
          <div class="block">
            <el-date-picker v-model="value1"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </td>
      </tr>
      <tr :hidden="processType.processName=='请假申请'">
        <td class="tdt">时长</td>
        <td class="tdc">
          <!-- v-model="123" -->
          <el-input type="number"
                    v-model="example.duration"></el-input>
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
        <td class="tdt">流转至</td>
        <td class="tdc">
          <!-- v-model="form.region" -->
          <el-select v-model="checkbumen"
                     placeholder="请选择部门">

            <el-option v-for="itm in selectDmt"
                       :key="itm.id"
                       :label="itm.name"
                       :value="itm.id"></el-option>
          </el-select>
          <el-select v-model="example.currentCheckStaffId"
                     placeholder="请选择审核人">
            <el-option v-for="itm in selectDmtStaff"
                       :key="itm.id"
                       :label="itm.name+' ('+itm.zhiwei+')'"
                       :value="itm.id"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="tdt">备注</td>
        <td class="tdc">
          <el-input v-model="example.remarks"
                    type="textarea"></el-input>
        </td>
      </tr>
      <tr>
        <td class="tdt">流程表单</td>
        <td class="tdc">
          <div id="demo1"></div>
        </td>
      </tr>
      <tr>
        <td class="tdt"
            colspan="2">
          <el-button @click="onSubmit">发起流程</el-button>

        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'

import ProcessTypeSv from '@/api/systemGMT/processType'
import DepartmentSv from '@/api/systemGMT/department'
import StaffSv from '@/api/systemGMT/sysstaff'
import processExampleSv from '@/api/systemGMT/processExample'

export default {
  data () {
    return {
      lableType: 'info',
      lableType2: 'info',
      wduration: 0,
      checkbumen: '',
      processTypeId: '',
      processType: { processName: '', processDescribe: '' },
      datalist: [{ name: '123' }],
      example: {
        exampleName: '',
        procTypeId: '',
        content: '',
        leve: "0",
        remarks: '',
        currentCheckStaffId: '',
        duration: 0, // 时长
        stratTime: '', // 流程开始时间
        endTime: '', // 流程结束时间
        tianshu: 0
      },
      selectDmt: [],
      selectDmtStaff: [],
      value1: ['', ''],
      liuc: ['', '']
    }
  },
  watch: {
    checkbumen (xv, jv) {
      this.getSelectStaffByBumenId(xv);
    }
    , value1 (x, j) {
      var startDate = Date.parse(x[0].replace('/-/g', '/'));
      var endDate = Date.parse(x[1].replace('/-/g', '/'));
      var diffDate = (endDate - startDate) + 1 * 24 * 60 * 60 * 1000;
      var days = diffDate / (1 * 24 * 60 * 60 * 1000);
      this.example.tianshu = days;
      if (this.liuc.length == 1) {
        this.lableType = 'warning';
        return;
      }
      if (days <= 2) {
        this.lableType = 'warning';
        this.lableType2 = 'info';
      } else {
        this.lableType2 = 'warning';
        this.lableType = 'info';
      }
    }
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  mounted () {
    this.getUrlKey('id'); // 获取流程类型Id
    this.getProcessType(); // 获取流程类型对象
    this.getSelectDeparments();//获取所有部门
    this.getlicu();
    const editor = new wangEditor(`#demo1`)
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
      this.example.stratTime = this.value1[0];
      this.example.endTime = this.value1[1];
      this.example.content = this.editor.txt.html();
      console.log(this.example);
      var jie = await processExampleSv.insertProcessExample(this.example);
      if (jie.code == 500)
        alert("错误")
      this.$notify({
        title: 'Success',
        message: "成功",
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.push({ path: '/flow/processExample/list' })
      }, 0.5 * 1000);
    }
    //解析流程
    , getlicu () {
      setTimeout(() => {
        var sarr = this.processType.processDescribe.split(',');
        console.log(sarr);
        this.liuc = sarr;
      }, 1000);
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
      this.processTypeId = urlc;
      this.example.procTypeId = urlc;
    }
    , async getProcessType () {
      var jie = await ProcessTypeSv.getEntityById(this.processTypeId);
      console.log(jie);
      this.processType = jie.data;
      this.editor.txt.html(jie.data.fromContent);
    }
  },
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
</style>