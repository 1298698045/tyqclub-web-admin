import request from '@/utils/request'

export default{
  async getProcessTypes(listQuery){
    var jie = await request.get('/processTypes',{params:listQuery});
    return jie;
  }
  ,async insertProcessType(processType){
    var res = await request.post('/processTypes',processType);
    return res;
  }
  ,async updateProcessType(processType){
    var res = await request.put('/processTypes',processType);
    return res;
  }
  ,async getEntityById(sid){
    var res = await request.get('/processTypes/getTypeById',{ params:{id:sid} });
    return res;
  }
  
}