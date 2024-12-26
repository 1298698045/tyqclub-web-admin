<template>
  <div>
    <form id="uploadForm"
          enctype="multipart/form-data">
      <p>指定文件名： <input type="text"
               name="filename"
               value="" /></p>
      <p>上传文件： <input type="file"
               name="file" /></p>
      <input type="button"
             value="上传"
             @click="doUpload" />
    </form>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  methods: {
    doUpload () {
      alert(123);
      Axios({
        url: "http://localhost:53168/api/navs",
        method: 'POST'
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style>
</style>