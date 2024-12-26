import request from '@/utils/request'

export default {
  async getPageList(listQuery) {
    var res = await request.get('/activitie/GetPageList', { params: listQuery });
    return res;
  },
  async getCategory() {
    var res = await request.get('/itemCategory/GetList', { params: { category: '1' } });
    return res;
  },
  async addActivitie(activitie) {
    var res = await request.post('/activitie', activitie);
    return res;
  },
  async deletePicture(id) {
    var res = await request.get('/activitie/deletePictureById', { params: { id } });
    return res;
  },
  async getActivitieLessonSignIn(id) {
    var res = await request.get('/activitieLessonSignIn/getListByActivitieId', { params: {id} });
    return res;
  },

  


}