import request from '@/utils/request'

export default{
  async getDepartments(listQuery){
    var res = await request.get('/departments',{params:listQuery});
    return res;
  }
  ,async insertDepartment(department){
    var res = await request.post('/departments',department);
    return res;
  }
  ,async updateDepartment(department){
    var res = await request.put('/departments',department);
    return res;
  }
  ,async deleteDepartment(id){
    var res = await request.put('/departments/putIsDelete/'+id);
    return res;
  }
  ,async getSelectDmt(){  //获取下拉框部门数据（id,name）
    var res = await request.get('/departments/getDepartments');
    return res;
  }
  ,async setDmtStaff(){ // 设置部门的部门经理

  }


}