import request from '@/utils/request'




export function login(data) {
  var res = request.post('/sysStaffs/login',data)
   return res;
}

export function getInfo(token) {
  return request({
    url: '/sysStaffs/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sysStaffs/logout',
    method: 'post'
  })
}
export function getMenus() {
  var tk = sessionStorage.getItem('token');// 获取token
  return request({
      url: '/sysactions',
      method: 'get',
      headers:{
        'verification':tk
      }
  })
}
