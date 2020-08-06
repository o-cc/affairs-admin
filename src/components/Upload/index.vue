<template>
  <el-upload
    class="upload-demo"
    :action="action"
    :headers="headers"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="1"
    :accept="accept"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-success="onSuccess"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
import { getToken } from '@/utils/auth';

export default {
  data() {
    return {
      fileList: []
    };
  },
  props: {
    accept: {
      type: String,
      default: 'image/*'
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
      default: '/api/test/media/images/'
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onSuccess(response) {
      this.$emit('onSuccess', response);
    },
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
