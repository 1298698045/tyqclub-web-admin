import request from '@/utils/request'

export default{
  async getSummarys(listQuery){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/summarys',
      method: 'get',
      params:listQuery,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getShenSummarys(listQuery){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/summarys/getshen',
      method: 'get',
      params:JSON.parse(listQuery) ,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async insertSummary(summary){
    var tk = sessionStorage.getItem('token');// 获取token
    var smy = JSON.parse(summary);
    console.log(smy);
    var res = await request({
      url: '/summarys',
      method: 'post',
      data:smy,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getSummaryById(sId){
    var tk = sessionStorage.getItem('token');// 获取token
    var res = await request({
      url: '/summarys/getSummaryById/'+sId,
      method: 'get',
      headers:{
        'verification':tk
      }
    })
    return res;
  }
  ,async getdlrInfo(){
    var res = await request({
      url: '/summarys/getdlrInfo',
      method: 'get',
    })
    return res;
  }
  ,async pingScore(smy){
    var res = await request({
      url: '/summarys/putScore',
      method: 'put',
      data:smy
    })
    return res;
    
  }
  
}