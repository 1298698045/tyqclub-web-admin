import request from '@/utils/request'

export default{
  async getNoticTypes(listQuery){
    var res = await request.get('/notictypes',{params:listQuery});
    return res;
  }
  ,async insertNoticType(notictype){
    var res = await request.post('/notictypes',notictype);
    return res;
  }
  ,async updateNoticType(notictype){
    var res = await request.put('/notictypes',notictype);
    return res;
  }
  ,async getSelectType(){
    var res = await request.get('/notictypes/getSelectNoticType');
    return res;
  }
}