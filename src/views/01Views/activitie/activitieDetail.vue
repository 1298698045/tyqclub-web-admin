<template>
  <el-row style="margin: 50px">
    <el-col :span="24">
      <el-row>
        <el-col :span="11">
          <el-row>
            <el-descriptions title="基本信息" :column="3" border>
              <el-descriptions-item label="活动名称">{{
                activitieObj.name
              }}</el-descriptions-item>
              <el-descriptions-item label="组织人">{{
                activitieObj.leader
              }}</el-descriptions-item>
              <el-descriptions-item label="所属栏目">{{
                activitieObj.itemCategoryName
              }}</el-descriptions-item>
              <el-descriptions-item label="开始时间">{{
                activitieObj.startTime
              }}</el-descriptions-item>
              <el-descriptions-item label="结束时间">
                {{ activitieObj.endTime }}
              </el-descriptions-item>
              <el-descriptions-item label="价格">{{
                activitieObj.price
              }}</el-descriptions-item>
              <el-descriptions-item label="建筑物标志">{{
                activitieObj.building
              }}</el-descriptions-item>
              <el-descriptions-item label="限制人数">{{
                activitieObj.maxStudents
              }}</el-descriptions-item>
              <el-descriptions-item label="已报名人数">{{
                activitieObj.currentStudents
              }}</el-descriptions-item>
              <el-descriptions-item label="可取消报名时间">{{
                activitieObj.cancelTime
              }}</el-descriptions-item>
              <el-descriptions-item label="是否推荐">{{
                activitieObj.isRecommend
              }}</el-descriptions-item>
              <el-descriptions-item label="活动状态">{{
                activitieObj.stateCode
              }}</el-descriptions-item>
              <el-descriptions-item label="活动地址">{{
                activitieObj.address
              }}</el-descriptions-item>
            </el-descriptions>
          </el-row>
          <el-row>
            <div ref="editor" style="margin-top: 20px"></div>
          </el-row>
          <el-row>
            <el-descriptions
              title="图片信息"
              :column="1"
              style="margin-top: 20px"
            >
              <el-descriptions-item label="">
                <div
                  class="demo-image"
                  v-for="picture in activitieObj.pictures"
                  :key="picture"
                >
                  <el-image
                    style="width: 150px; margin-right: 10px"
                    :src="imgAddress + picture.fileLocation"
                    fit="scale-down"
                  >
                  </el-image>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-row>
        </el-col>
        <el-col :span="13">
          <el-row style="margin: 0 0 0 20px">
            <el-col :span="24">
              <el-row>
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="" style="padding-right: 5px">
                    <el-input
                      t
                      v-model="listQuery.search"
                      placeholder="名称"
                      style="width: 150px"
                      class="filter-item"
                      size="small"
                    />

                  </el-form-item>
                  <el-form-item label="时间">
                    <div class="block">
                      <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        placeholder="选择日期范围"
                        style="width: 250px"
                        size="small"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" @click="handleFilter"
                      >搜索</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row lzk_describe="Tab切换">
                <el-tabs v-model="activeName" type="card">
                  <el-tab-pane label="报名记录" name="first">
                    <el-table
                      :data="signInList"
                      border
                      stripe
                      style="width: 100%"
                      height="600"
                    >
                      <el-table-column
                        label="序号"
                        width="80px"
                        align="center"
                        type="index"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="nickName"
                        label="昵称"
                        width="120"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="levelName"
                        label="会员等级"
                        width="120"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="phoneNumber"
                        label="联系电话"
                        width="120"
                      >
                      </el-table-column>
                      <el-table-column prop="reservationTime" label="报名时间">
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                          <el-button
                            @click.native.prevent="
                              deleteRow(scope.$index, tableData)
                            "
                            type="text"
                            size="small"
                          >
                            退费
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="签到记录" name="second">
                    <el-table
                      :data="signInList"
                      border
                      stripe
                      style="width: 100%"
                      height="600"
                    >
                      <el-table-column
                        label="序号"
                        width="80px"
                        align="center"
                        type="index"
                      >
                      </el-table-column>
                       <el-table-column
                        prop="nickName"
                        label="昵称"
                        width="120"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="levelName"
                        label="会员等级"
                        width="120"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="phoneNumber"
                        label="联系电话"
                        width="180"
                      >
                      </el-table-column>
                      <el-table-column prop="signInTime" label="签到时间">
                      </el-table-column>
                      <el-table-column prop="signInType" label="签到结果">
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                          <el-button
                            @click.native.prevent="
                              deleteRow(scope.$index, tableData)
                            "
                            type="text"
                            size="small"
                          >
                            签到
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import ActivitieSv from "@/api/systemGMT/activitie";
import Editorcs from "wangeditor";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      activitieObj: null,
      activeName: "first", //tab默认选中
      imgAddress: "http://47.96.15.8:9006",
      dateRange: [],
      selectedValue: "-1",
      signUpData: null,
      signInData: null,
      pointsData: null,
      signInList: null,
      listQuery: {
        memberId: null,
        search: "",
        category: "",
        stratTime: "",
        endTime: "",
        page: 1,
        rows: 10,
        sort: true,
      },
      upTotal: 0,
      inTotal: 0,
      value1: 0,
      value2: 0,
      title: "增长人数",
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    };
  },
  created() {
    this.activitieObj = this.$route.query.queryParam;
  },
  mounted() {
    this.editor = new Editorcs(this.$refs.editor);
    this.editor.config.menus = [];
    this.editor.config.height = "150";
    this.editor.create();

    // 设置初始内容
    this.editor.txt.html(this.activitieObj.description);
    this.editor.disable();
    this.getSignInList();
    
  },
  methods: {
    async handleFilter(){

    },
    async getSignInList() {
      var res = await ActivitieSv.getActivitieLessonSignIn(
        this.activitieObj.id
      );
      if ((res.code = 20000)) {
        this.signInList = res.data;
      }
    },
  },
};
</script>

<style>
</style>