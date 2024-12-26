import request from '@/utils/request'

export default{
  async getActions(){ // 修改权限获取菜单
    var jie = await request.get('/sysactions/getAll');
    return jie;
  },
  async getTableActions(){
    var res = await request.get('/sysactions/getTableAction');
    return res;
  },
  async getChildAction(actionId){
    var res = await request.get('/sysactions/getChildAction/'+actionId);
    return res;
  }

  
}