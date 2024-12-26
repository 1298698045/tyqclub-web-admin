import request from '@/utils/request'

export default{
  async getStaffs(listQuery){
    var res = await request.get('/sysstaffs',{params:listQuery});
    return res;
  }
  ,async getRoleByStaffId(id){
    var res = await request.get('/sysstaffs/getRolesByStaffId',{params:{id}});
    return res;
  }
  
  ,async insertStaffs(staff){
    console.log(staff);
    var res = await request.post('/sysstaffs/add',staff);
    return res;
  }
  ,async updateStaffs(staff){
    var res = await request.put('/sysstaffs',staff);
    return res;
  }
  ,async deleteStaffs(id){
    var res = await request.put('/sysstaffs/putIsDelete/'+id);
    return res;
  }
  ,async getdmtStaff(dmtId){
    var res = await request.get('/sysstaffs/getStaffsByDeparmentId',{params:{'did':dmtId}});
    return res;
  }
  ,async setRoles(staffId,roleIds){
    var res = await request({
      url: '/sysstaffs/setSysRole/'+staffId,
      method: 'put',
      data:roleIds
    })
    return res;
  }
  
}