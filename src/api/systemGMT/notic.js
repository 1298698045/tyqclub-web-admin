import request from '@/utils/request'

export default{
  async getNotics(listQuery){
    var res = await request.get('/notics',{params:listQuery});
    return res;
  }
  ,async insterNotics(notic){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics',
      method: 'post',
      data:  notic,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getdmts(){
    var res = await request.get('/notics/getDepartments');
    return res;
  }
  ,async getNoticById(id){
    var res = await request.get('/notics/getNoticById/'+id);
    return res;
  }
  ,async getxxNoticById(id){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics/getXXNoticById/'+id,
      method: 'get',
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async updateNotics(notic){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics',
      method: 'put',
      data:  notic,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getTongZhiNotic(){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics/getTongZhiNotic',
      method: 'get',
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async putShouDao(nt){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics/putShouDao',
      method: 'put',
      data:nt,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getNoticsList(listQuery){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/notics/getList',
      method: 'get',
      data:listQuery,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  

}