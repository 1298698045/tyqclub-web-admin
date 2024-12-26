import request from '@/utils/request'

export default{
  async getPageList(listQuery){
    var res = await request.get('/memberlevels/GetPageList',{params:listQuery});
      return res;
  }
  ,async insertLevel(level){
    var res = await request.post('/memberlevels',level);
    return res;
  }
  ,async updateLevel(level){
    var res = await request.put('/memberlevels',level);
    return res;
  }
  ,async updateDefault(id){
    var res = await request.get('/memberlevels/editDefault',{params:{id}});
    return res;
  }
 

  



}