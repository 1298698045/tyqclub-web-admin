import request from '@/utils/request'

export default{
    async insertProcessExample(processExample){
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples',
        method: 'post',
        data:processExample,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
    ,async getProcessExamples(listQuery){ // 查询我发起的流程实例
      listQuery.stateStr = "申请中"
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples',
        method: 'get',
        params:listQuery,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
    ,async getShenheProcessExamples(listQuery){ // 查询我要审核的流程实例
      listQuery.stateStr = "申请中"
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples/getShenhe',
        method: 'get',
        params:listQuery,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
    ,async getWanBiProcessExamples(listQuery){ // 查询我已审核完毕的流程实例
      listQuery.stateStr = "通过或驳回"
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples',
        method: 'get',
        params:listQuery,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
    ,async getporcessExamAndSteps(empid){ // 查询我申请审核的详细信息
      var res = await request({
        url: '/processExamples/getExampleById',
        method: 'get',
        params:{'pempId':empid}
      })
      return res;
    }
    ,async getshenheguo(listQuery){ // 查询我要审核的流程实例
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples/getShenheguo',
        method: 'get',
        params:listQuery,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
    //
    ,async shenheporcessExample(cs){ // 提交我审核的结果
      var jsonpstepUp = JSON.stringify(cs.pstepUp)
      var jsonppstepObj = JSON.stringify(cs.pstepObj)
      var newcs = {'id':cs.id,'pstepUp':jsonpstepUp,'pstepObj':jsonppstepObj};
      var tk = sessionStorage.getItem('token');// 获取token
      var res = await request({
        url: '/processExamples/tjshenhe',
        method: 'get',
        params:  newcs,
        headers:{
          'verification':tk
        }
      })
      return res;
    }
  // 
  // ,async updateProcessType(processType){
  //   var res = await request.put('/processTypes',processType);
  //   return res;
  // }
  // ,async getEntityById(sid){
  //   var res = await request.get('/processTypes/getTypeById',{ params:{id:sid} });
  //   return res;
  // }
  
}