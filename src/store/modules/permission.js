import {  constantRoutes } from '@/router'
import { getMenus } from '@/api/user'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getMenus().then(res=>{
        
        console.log('输出返回值');
        var RomeRouters = res.data;
        
        RomeRouters.forEach(RomeRouter => {
          if (RomeRouter.component === 'Layout') {
            RomeRouter.component = Layout
          } else {
            let subView = RomeRouter.component
            subView = subView.replace(/^\/*/g, '')
            RomeRouter.component = resolve => require([`@/views/01Views/${subView}`], resolve)
            console.log(RomeRouter.component);
          }
          var nxlist = [];
          var i=0;
          if(RomeRouter.children){
            RomeRouter.children.forEach(cl => {
              if(i == 0){
                RomeRouter.redirect = RomeRouter.path +'/'+ cl.path;
                console.log('123213213');
              }
              i++;
              var zirouter= {
                'path':cl.path,
                'name':cl.name,
                'meta':cl.meta,
                'hidden':false
              }

              if(cl.name =="71112231-1111-1111-1111-111111111136" || cl.name =="71112231-1111-1111-1111-111111111137" || cl.name == '71112231-1111-1111-1111-111111111139' || cl.name == 'c2331231-1111-1111-1111-111111111111' || cl.name == 'ab111111-1231-2231-2222-111111111111' || cl.name == '00000001-0000-0000-0000-000000011111' || cl.name=='71112231-1111-1111-1111-112311111111' || cl.name =='71112231-1111-1111-1111-112311111122' || cl.name == '71112231-1111-1111-1111-112311111123' || cl.name=='71112231-1111-1111-1111-111111111126' || cl.name=='71112231-1111-1111-1111-111111111127' || cl.name == '71112231-1111-1111-1111-111111111129'){
                zirouter.hidden = true;
              }
              if (cl.component === 'Layout') {
                cl.component = Layout
                zirouter.component=Layout
              } else {
                let subView = cl.component
                console.log(subView);
                console.log("1111111111111111111111");
                subView = subView.replace(/^\/*/g, '')
                cl.component = resolve => require([`@/views/01Views/${subView}`], resolve)
                zirouter.component = resolve => require([`@/views/01Views/${subView}`], resolve)
              }
              
              nxlist.push(zirouter)
              console.log(zirouter);
              console.log('2222222222222222222');
            });
            RomeRouter.children = nxlist;
            console.log(RomeRouter);
            console.log('------123123-----');
          }
      
        });
        console.log(RomeRouters);
        console.log('输出新值');
        console.log('输出新值');
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = RomeRouters || []
        } else {
          accessedRoutes = filterAsyncRoutes(RomeRouters, roles)
        }

        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(err=>{
        console.log(err+'123');
      })

      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
