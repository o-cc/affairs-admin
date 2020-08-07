<template>
  <el-form :model="info" class="form">
    <el-form-item label="类别名称" :label-width="formLabelWidth">
      <el-input
        :disabled="!isModify"
        class="input"
        v-model="info.name"
        autocomplete="off"
        placeholder="类别名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="类别识别标识key" :label-width="formLabelWidth">
      <el-input
        :disabled="!isModify"
        class="input"
        v-model="info.key"
        autocomplete="off"
        placeholder="类别识别标识key"
      ></el-input>
    </el-form-item>
    <el-form-item label="修改" :label-width="formLabelWidth">
      <el-switch v-model="isModify"></el-switch>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" v-if="isModify">
      <el-button type="primary" size="small" @click="handleClick('cancel')">
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        :isLoading="isLoading"
        @click="handleClick('modify')"
      >
        修改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putAd } from '@/api';
import { Message } from 'element-ui';
export default {
  props: {
    open: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default() {
        return {
          name: '',
          key: ''
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      info: {},
      isModify: false,
      isLoading: false
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    handleClick(type) {
      if (type === 'cancel') {
        this.$confirm('确认取消吗?').then(() => {
          this.info = this.form;
        });
        return;
      }
      let error = '';
      if (!this.info.name) {
        error = '请输入名称';
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }
      this.isLoading = true;
      putAd(this.info)
        .then(() => {
          Message({ message: '修改成功', type: 'success' });
          this.$emit('afterFetch');
          this.isLoading = false;
          this.isModify = false;
        })
        .catch(e => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.input {
  width: 350px;
}
</style>
