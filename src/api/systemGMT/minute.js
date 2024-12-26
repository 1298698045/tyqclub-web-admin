import request from '@/utils/request'

export default{
  async getMinutes(listQuery){
    var res = await request.get('/minutes',{params:listQuery});
    return res;
  }
  ,async insertMinute(minute){
    var newminute = {'title':minute.title,'content':minute.content}
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/minutes',
      method: 'post',
      data:  newminute,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async updateMinute(minute){
    var res = await request.put('/minutes',minute);
    return res;
  }
  ,async getTongjiMinute(){
    var res = await request.get('/minutes/getTongji');
    return res;
  }
  ,async getminuteById(id){
    var res = await request.get('/minutes/getminuteById/'+id);
    return res;
  }
}