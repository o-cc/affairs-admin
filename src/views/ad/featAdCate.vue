<template>
  <el-dialog
    :title="isModify ? '修改广告类别' : '添加广告类别'"
    :visible.sync="open"
    :before-close="close"
  >
    <el-form :model="info" class="form">
      <el-form-item label="类别名称" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.name"
          autocomplete="off"
          placeholder="类别名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类别识别标识key" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.key"
          autocomplete="off"
          placeholder="类别识别标识key"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="feat">
        {{ isModify ? '修改' : '添加' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postAd } from '@/api';
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
    },
    isModify: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      info: {}
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    feat() {
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

      postAd(this.info)
        .then(() => {
          Message({ message: '添加成功' });
          this.$emit('afterFetch');
        })
        .catch(e => {});
    }
  }
};
</script>

<style scoped>
.input {
  max-width: 350px;
}
</style>
