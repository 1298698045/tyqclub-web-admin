import request from '@/utils/request'

export default{
  async getRoles(listQuery){
    var res = await request.get('/sysroles/getra',{params:listQuery});
    return res;
  }
  ,async getAllRoles(){
    var res = await request.get('/sysroles/getAllRoles');
    return res;
  }
  ,async insertRole(Role){
    var res = await request.post('/sysroles',Role);
    return res;
  }
  ,async updateRole(Role){
    var res = await request.put('/sysroles',Role);
    return res;
  }
  ,async deleteRole(id){
    var res = await request.put('/sysroles/putIsDelete/'+id);
    return res;
  }
  ,async getSelectRole(){  //获取下拉框角色数据（id,name）
    var res = await request.get('/sysroles/getRoles');
    return res;
  }
  ,async setAction(roId,actionIds){ // 修改角色的权限
    var tk = sessionStorage.getItem('token');// 获取token
    //var res = await request.post('/sysroles/setActionByRoId',actionIds,headers={'verification':tk});
    var res = await request({
      url: '/sysroles/setActionByRoId/'+roId,
      method: 'post',
      data:actionIds,
      headers:{
        'verification':tk
      }
    })
    return res;
  }
}