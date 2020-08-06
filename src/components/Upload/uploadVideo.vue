<template>
  <!-- :headers="headers" -->
  <el-upload
    class="upload-demo"
    :action="action"
    :before-remove="beforeRemove"
    :limit="1"
    :accept="accept"
    :file-list="fileList"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    :data="dataObj"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
import { getToken } from '@/utils/auth';
import { getVideoToken } from '@/api';

export default {
  data() {
    return {
      fileList: [],
      dataObj: { token: '', key: '' },
      tempUrl: ''
    };
  },
  props: {
    accept: {
      type: String
    },
    headers: {
      type: Object,
      default() {
        return {
          Authorization: `JWT ${getToken()}`
        };
      }
    },
    action: {
      type: String,
      default: 'http://upload.qiniup.com'
    }
  },
  methods: {
    onSuccess(response) {
      this.$emit('onSuccess', url);
    },
    beforeUpload() {
      const _self = this;
      return new Promise((resolve, reject) => {
        getVideoToken()
          .then(response => {
            const key = response.data.key;
            const token = response.data.token;
            const image_url = response.data.image_url;
            this.dataObj = { token, key };
            this.tempUrl = response.data.image_url;
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
