<template>
  <el-row :gutter="20" style="padding-left: 30px; padding-top: 50px">
    <el-col :span="24" style="margin: 0px 0px 20px 80px"
      ><h3>
        {{ ruleForm.mode == 1 ? "创建" : ruleForm.mode == 2 ? "修改" : "查看" }}
      </h3>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类" prop="folderId">
            <el-select
              v-model="ruleForm.folderId"
              placeholder="请选择"
              :disabled="ruleForm.mode == 3"
            >
              <el-option
                v-for="item in itemCategorys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="5">
              <el-form-item label="活动时间" prop="activData">
                <div class="block">
                  <span class="demonstration"></span>
                  <el-date-picker
                    v-model="ruleForm.activData"
                    type="date"
                    placeholder="选择日期"
                    :disabled="ruleForm.mode == 3"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="activTime">
                <el-time-picker
                  is-range
                  v-model="ruleForm.activTime"
                  format="HH:mm"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  style="margin-left: 10px"
                  :disabled="ruleForm.mode == 3"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="截至报名时间" prop="cancelTime">
                <div class="block">
                  <span class="demonstration"></span>
                  <el-date-picker
                    v-model="ruleForm.cancelTime"
                    type="date"
                    placeholder="选择日期"
                    :disabled="ruleForm.mode == 3"
                  >
                  </el-date-picker>
                </div> </el-form-item
            ></el-col>
          </el-row>

          <el-form-item label="组织人" prop="leader">
            <el-input
              v-model="ruleForm.leader"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>

          <el-form-item label="活动地址" prop="address">
            <el-input
              v-model="ruleForm.address"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>
          <el-form-item label="标志性建筑" prop="building">
            <el-input
              v-model="ruleForm.building"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input
              type="number"
              v-model="ruleForm.longitude"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input
              type="number"
              v-model="ruleForm.latitude"
              :disabled="ruleForm.mode == 3"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="5">
              <el-form-item label="报名费用" prop="price" style="width: 250px">
                <el-input
                  type="number"
                  placeholder="费用"
                  v-model.number="ruleForm.price"
                  :disabled="ruleForm.mode == 3"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="5">
              <el-form-item
                label="限制人数"
                prop="maxStudents"
                style="width: 250px"
              >
                <el-input
                  type="number"
                  placeholder="最大人数"
                  v-model.number="ruleForm.maxStudents"
                  :disabled="ruleForm.mode == 3"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="6">
              <el-form-item label="是否推荐" prop="isRecommend">
                <el-checkbox
                  v-model="ruleForm.isRecommend"
                  :disabled="ruleForm.mode == 3"
                ></el-checkbox> </el-form-item
            ></el-col>
          </el-row>

          <el-form-item label="活动介绍" prop="description">
            <!--<el-input  :rows="10" type="textarea" v-model="ruleForm.description" ></el-input> -->
            <div ref="editor" :disabled="ruleForm.mode == 3"></div>
          </el-form-item>
          <el-form-item>
            <el-upload
              action="http://localhost:23999/api/activitie/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :on-success="handleSuccess"
              multiple
              :disabled="ruleForm.mode == 3"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :disabled="ruleForm.mode == 3"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Editorcs from "wangeditor";
// import VueGoogleMapsLocationPicker from 'vue-google-maps-location-picker';

import ActivitieSv from "@/api/systemGMT/activitie";
import { date } from "jszip/lib/defaults";
export default {
  components: {},
  data() {
    return {
      dialogImageUrl: "",
      imgAddress: "http://47.96.15.8:9006",
      fileList: [],
      dialogVisible: false,
      editor: null,
      itemCategorys: [],
      ruleForm: {
        name: null,
        description: null,
        leader: null,
        startTime: null,
        endTime: null,
        folderId: null,
        price: 0,
        maxStudents: 0,
        stateCode: 1,
        address: null,
        building: null,
        longitude: null,
        latitude: null,
        isRecommend: false,
        cancelTime: new Date(),
        activitiePictures: [],
        activData: new Date(),
        activTime: null,
        mode: 1, //1 创建 2修改 3查看
      },
      rules: {
        folderId: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        leader: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        address: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        building: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        cancelTime: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        activData: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        activTime: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        maxStudents: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    //初始化下拉框
    this.GetCategory();
    if (this.$route.query.queryParam) {
      this.ruleForm = this.$route.query.queryParam;
      console.log(this.ruleForm);
    }

    //编辑或者查看时初始化数据
    if (this.ruleForm.startTime && this.ruleForm.endTime) {
      var startT = new Date(this.ruleForm.startTime);
      var endT = new Date(this.ruleForm.endTime);
      //年
      var year = startT.getFullYear();
      //月
      var month = startT.getMonth() + 1;
      //日
      var strDate = startT.getDate();
      //时
      var shour = startT.getHours();
      //分
      var sminute = startT.getMinutes();

      //时
      var ehour = endT.getHours();
      //分
      var eminute = endT.getMinutes();
      month = month > 9 ? month : "0" + month;
      strDate = strDate > 9 ? strDate : "0" + strDate;
      shour = shour > 9 ? shour : "0" + shour;
      sminute = sminute > 9 ? sminute : "0" + sminute;

      ehour = ehour > 9 ? ehour : "0" + ehour;
      eminute = eminute > 9 ? eminute : "0" + eminute;
      var startdata =
        year + "-" + month + "-" + strDate + " " + shour + ":" + sminute;
      var enddata =
        year + "-" + month + "-" + strDate + " " + ehour + ":" + eminute;

      this.ruleForm.activData = year + "-" + month + "-" + strDate;
      this.ruleForm.activTime = [startdata, enddata];
    }

    this.ruleForm.activitiePictures.forEach((file, index) => {
      const fileObj = {
        name: file.id,
        url: this.imgAddress + file.fileLocation,
      };
      this.fileList.push(fileObj);
    });

    this.editor = new Editorcs(this.$refs.editor);
    this.editor.create();

    this.editor.txt.html(this.ruleForm.description);
    //监听内容变化并更新article.content
    this.editor.config.onchange = (newHtml) => {
      this.ruleForm.description = newHtml;
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var dateTime = new Date(this.ruleForm.activData);
          var sTime = new Date(this.ruleForm.activTime[0]);
          var eTime = new Date(this.ruleForm.activTime[1]);
          //年
          var year = dateTime.getFullYear();
          //月
          var month = dateTime.getMonth() + 1;
          //日
          var strDate = dateTime.getDate();
          //时
          var shour = sTime.getHours();
          //分
          var sminute = sTime.getMinutes();

          //时
          var ehour = eTime.getHours();
          //分
          var eminute = eTime.getMinutes();

          month = month > 9 ? month : "0" + month;
          strDate = strDate > 9 ? strDate : "0" + strDate;
          shour = shour > 9 ? shour : "0" + shour;
          sminute = sminute > 9 ? sminute : "0" + sminute;

          ehour = ehour > 9 ? ehour : "0" + ehour;
          eminute = eminute > 9 ? eminute : "0" + eminute;

          var startdata =
            year + "-" + month + "-" + strDate + " " + shour + ":" + sminute;

          var enddata =
            year + "-" + month + "-" + strDate + " " + ehour + ":" + eminute;
          this.ruleForm.startTime = startdata;
          this.ruleForm.endTime = enddata;

          const dayjs1 = new Date(startdata);
          const dayjs2 = new Date(enddata);
          const dayjs3 = new Date();

          const dayjs4 = new Date(this.ruleForm.cancelTime);
          if (dayjs3 > dayjs1) {
            alert("开始时间必须大于当前时间");
            return false;
          }
          if (dayjs4 > dayjs3 && dayjs4 <= dayjs2) {
            var res = ActivitieSv.addActivitie(this.ruleForm);
            console.log(res);
            if (res.code == 20000) {
              alert("添加活动成功");
              return true;
            }
          } else {
            alert("截至报名时间异常");
            return false;
          }
        } else {
          return false;
        }
      });
    },
    async GetCategory() {
      var res = await ActivitieSv.getCategory();
      this.itemCategorys = res.data;
    },
    handleRemove(file) {
      const index = this.ruleForm.activitiePictures.findIndex(
        (item) => item.id === file.name
      );
      if (index !== -1) {
        this.ruleForm.activitiePictures.splice(index, 1);
      }
      //修改时
      if( this.ruleForm.mode == 2){
        ActivitieSv.deletePicture(file.name);
      }
    },
    handleChange(file, fileList) {
      // // 每次选择文件后，将新的文件路径添加到数组中
      // this.fileObjects.filePaths = fileList.map((item) => item.url);
      // console.log("文件列表已改变", fileList);
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 2000) {
        const fileObj = response.data[0];
        this.ruleForm.activitiePictures.push(fileObj);
      } else {
        alert("上传异常");
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style></style>