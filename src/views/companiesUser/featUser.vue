<template>
  <el-dialog title="添加用户" :visible.sync="open" :before-close="close">
    <el-form :model="form" class="form">
      <el-form-item label="用户名称" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="number"
          v-model="form.mobile"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="输入密码" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="password"
          v-model="form.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth">
        <el-input class="input" type="password" v-model="form.repwd"></el-input>
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
import { postCompanyUser } from '@/api';
import { Message } from 'element-ui';
export default {
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
        mobile: '',
        repwd: ''
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    close() {
      this.$emit('onClose');
    },
    feat() {
      let error = '';
      if (!this.form.username) {
        error = '请输入用户名';
      } else if (this.form.mobile.length < 11) {
        error = '请输入正确手机号';
      } else if (this.form.password.length < 5) {
        error = '请设置6位以上的密码';
      } else if (this.form.repwd !== this.form.password) {
        error = '确认密码不匹配';
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }
      postCompanyUser(this.form)
        .then(() => this.$emit('afterFeat'))
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
