<template>
  <el-dialog title="添加活动" :visible.sync="open" :before-close="close">
    <el-form :model="actInfo" class="form">
      <el-form-item label="活动名称" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="actInfo.name"
          autocomplete="off"
          placeholder="活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动简介" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="actInfo.desc"
          autocomplete="off"
          placeholder="活动简介"
          type="textarea"
          :row="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否展示活动" :label-width="formLabelWidth">
        <el-switch v-model="actInfo.is_show"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="feat">
        添加
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postActivities } from '@/api';
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
          desc: '',
          is_show: false
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      actInfo: {}
    };
  },
  mounted() {
    this.actInfo = this.form;
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    feat() {
      let error = '';
      if (!this.actInfo.name) {
        error = '请输入活动名称';
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }
      postActivities(this.actInfo)
        .then(() => this.$emit('afterFetch'))
        .catch(e => {});
    }
  }
};
</script>

<style scoped>
.input {
  width: 350px;
}
</style>
