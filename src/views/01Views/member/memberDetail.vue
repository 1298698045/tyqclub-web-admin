<template>
  <div style="margin: 40px 20px 20px 20px">
    <el-row>
      <el-col :span="10">
        <el-row lzk_describe="头像">
          <el-col :span="24" style="text-align: center">
            <div class="block">
              <el-avatar
                shape="square"
                :size="120"
                v-if="memberObj.avatarUrl"
                :src="memberObj.avatarUrl"
              ></el-avatar>

              <el-avatar
                shape="square"
                :size="120"
                v-else
                icon="el-icon-user-solid"
              ></el-avatar>
            </div>
          </el-col>
        </el-row>
        <el-row lzk_describe="统计" :gutter="20" style="margin-top: 50px">
          <el-row>
            <el-col :span="8">
              <div>
                <el-statistic title="消费总金额">
                  <template slot="formatter"> 0 </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic
                  group-separator=","
                  :precision="2"
                  :value="value2"
                  title="报名次数"
                ></el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="积分总额">
                  <template slot="formatter"> 0 </template>
                </el-statistic>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 35px">
            <el-col :span="8">
              <div>
                <el-statistic title="本月消费金额">
                  <template slot="formatter"> 0 </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="本月报名次数">
                  <template slot="formatter"> 0 </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-statistic title="本月获取积分">
                  <template slot="formatter"> 0 </template>
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <el-row lzk_describe="用户信息" style="margin-top: 50px">
          <el-col :span="24">
            <el-descriptions
              class="margin-top"
              title="用戶基本信息"
              :column="2"
              size="medium"
              border
            >
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  昵称
                </template>
                {{ memberObj.userName }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  微信名称
                </template>
                {{ memberObj.nickName }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-s-custom"></i>
                  会员等级
                </template>
                {{ memberObj.levelName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-time"></i>
                  成为会员时间
                </template>
                {{ memberObj.leavelRegisterTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-message"></i>
                  电子邮箱
                </template>
                {{ memberObj.email }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-phone"></i>
                  手机号
                </template>
                {{ memberObj.phoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-male"></i>
                  性别
                </template>
                {{ memberObj.gender == 1 ? "女" : "男" }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  年龄
                </template>
                {{ memberObj.age }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  身份证号码
                </template>
                {{ memberObj.idNumber }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  家庭地址
                </template>
                {{ memberObj.address }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  注册时间
                </template>
                {{ memberObj.lastLoginTime }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  最近登录时间
                </template>
                {{ memberObj.lastLoginTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  兴趣爱好
                </template>
                {{ memberObj.hobby }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile"></i>
                  个性签名
                </template>
                {{ memberObj.signature }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row style="margin-left: 15px">
         <el-form :inline="true" class="demo-form-inline">
                  <el-form-item>
                    <el-select
                      v-model="selectedValue"
                      style="padding-right: 5px;width: 150px"
                      size="small"
                    >
                      <el-option value="-1" label="全部" />
                      <el-option value="1" label="活动" />
                      <el-option value="2" label="课程" />
                      <el-option value="3" label="旅游" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" style="padding-right: 5px">
                    <el-input
                      t
                      v-model="listQuery.search"
                      placeholder="名称"
                      style="width: 150px"
                      class="filter-item"
                      @keyup.enter.native="handleFilter"
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
        <el-row lzk_describe="Tab切换" style="margin-left: 15px">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="报名记录" name="first">
              <el-table :data="signUpData" border stripe style="width: 100%"    height="500">
                <el-table-column label="序号" width="80px" align="center" type="index">
                 </el-table-column>
                <el-table-column
                  prop="businessType"
                  label="报名类型"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="businessName"
                  label="关联对象"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="reservationTime" label="报名时间">
                </el-table-column>
              </el-table>
              <pagination
                v-show="upTotal > 0"
                :total="upTotal"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.rows"
                @pagination="GetSignUpData"
              />
            </el-tab-pane>
            <el-tab-pane label="签到记录" name="second">
              <el-table :data="signInData" border stripe style="width: 100%"    height="500">
                <el-table-column
                  prop="businessType"
                  label="报名类型"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="businessName"
                  label="关联对象"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="businessStartTime"
                  label="开始时间"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="signInTime" label="签到时间">
                </el-table-column>
                <el-table-column prop="signInType" label="签到结果">
                </el-table-column>
              </el-table>
               <pagination
                v-show="inTotal > 0"
                :total="inTotal"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.rows"
                @pagination="GetSignInData"
              />
            </el-tab-pane>
            <el-tab-pane label="积分变动" name="third">
              <el-table border :data="pointsData" stripe style="width: 100%"    height="500">
                <el-table-column
                  prop="businessType"
                  label="报名类型"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="businessName"
                  label="关联对象"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="reservationTime" label="报名时间">
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MemberSv from "@/api/systemGMT/member";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      memberObj:null,
      activeName: "first", //tab默认选中
      dateRange: [],
      selectedValue:"-1",
      signUpData: null,
      signInData: null,
      pointsData: null,
      listQuery: {
        memberId: null,
        search: '',
        category:'',
        stratTime: '',
        endTime: '',
        page: 1,
        rows: 10,
        sort: true,
      },
      upTotal: 0,
      inTotal: 0,
      value1: 0,
      value2: 0,
      title: "增长人数",
    };
  },
  created() {
    this.memberObj = this.$route.query.queryParam;
    this.listQuery.memberId = this.memberObj.id;
    this.listQuery.category=this.selectedValue;
    this.GetSignUpData();
    this.GetSignInData();
  },
  mounted() {},
  methods: {
    async GetSignUpData() {
      var jie = await MemberSv.GetSignUpPageList(this.listQuery);
      this.signUpData = jie.data;
      this.upTotal = jie.total;
    },
    async GetSignInData() {
      var jie = await MemberSv.GetSignInPageList(this.listQuery);
      this.signInData = jie.data;
      this.inTotal = jie.total;
        
    },
    async GetAbstract() {},
    handleFilter() {
      this.listQuery.page = 1;
      if (this.dateRange) {
        this.listQuery.startTime = this.dateRange[0];
        this.listQuery.endTime = this.dateRange[1];
      }else{
        this.listQuery.startTime = '';
        this.listQuery.endTime ='';
      }
         if(this.selectedValue){
           this.listQuery.category =this.selectedValue;
        }else{
            this.listQuery.category ='-1';
        }

      this.GetSignUpData();
      this.GetSignInData();
    },
  },
};
</script>

<style lang="scss">
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>