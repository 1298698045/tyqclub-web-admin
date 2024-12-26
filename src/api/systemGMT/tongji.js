import request from '@/utils/request'

export default{
  async getQingJia(listQuery){
    var res = await request.get('/tongjis/getQingJia',{params:listQuery});
    return res;
  }
  , async getJiaBan(listQuery){
    var res = await request.get('/tongjis/getJiaBan',{params:listQuery});
    return res;
  }
  , async getQingJiaxx(listQuery){
    var res = await request.get('/tongjis/getQjXX',{params:listQuery});
    return res;
  }
  , async getJiaBanxx(listQuery){
    var res = await request.get('/tongjis/getjbXX',{params:listQuery});
    return res;
  }

}