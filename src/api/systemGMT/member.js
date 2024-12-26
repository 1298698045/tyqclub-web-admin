import request from '@/utils/request'

export default{
  async getPageList(listQuery){
    var res = await request.get('/members/GetPageList',{params:listQuery});
      return res;
  },
  async GetSignUpPageList(listQuery){
    var res = await request.get('/members/GetSignUpPageList',{params:listQuery});
      return res;
  }
  ,async GetSignInPageList(listQuery){
    var res = await request.get('/members/getSignInPageList',{params:listQuery});
      return res;
  }
 

  


}