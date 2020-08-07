<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="action"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="limit"
      :accept="accept"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-success="onSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth';

export default {
  data() {
    return {
      fileList: [],
      url: ''
    };
  },
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    limit: {
      type: Number,
      default: 1
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
    handlePreview(file) {},
    onSuccess(response) {
      this.$emit('onSuccess', response);
      if (this.limit === 0) return;
      this.url = response.image_url;
    },
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {
      // console.log(this.limit);
      // if (this.limit === 0) return;
      // return this.$confirm(`确定移除 ${file.name}？`).then(() => {
      //   // file.response && this.$emit('removeImg', file.response);
      // });
    }
  }
};
</script>
