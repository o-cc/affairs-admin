<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" :before-close="close">
      <el-form :model="form" class="form">
        <el-form-item label="修改密码" :label-width="formLabelWidth">
          <el-switch
            v-model="changePwd"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="changePwd" :label-width="'50px'">
          <el-input
            class="input"
            style="width: 150px;"
            v-model="pwd"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
          <el-input
            class="input"
            style="width: 150px; margin: 0 10px;"
            v-model="rePwd"
            placeholder="请重复密码"
            autocomplete="off"
            type="password"
          ></el-input>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="loading"
            @click="modifiedPwd"
          >
            确认修改
          </el-button>
        </el-form-item>
        <el-divider></el-divider>
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
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input
            class="input"
            type="email"
            v-model="form.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.integral"></el-input>
        </el-form-item>
        <el-form-item label="头像链接" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.avatar"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.addr"></el-input>
        </el-form-item>
        <el-form-item label="区域" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.area"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.company"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.departments"></el-input>
        </el-form-item>
        <el-form-item label="职业" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.job"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="是否活跃" :label-width="formLabelWidth">
          <el-switch v-model="form.is_active"></el-switch>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth">
          <el-switch v-model="form.is_admin"></el-switch>
        </el-form-item>
        <el-form-item label="最后一次登录" :label-width="formLabelWidth">
          <el-input class="input" v-model="form.last_login" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <el-input
            class="input"
            v-model="form.date_joined"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close">取 消</el-button>
        <el-button type="primary" @click.native="modified">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putCompanyUserInfo, putUserPwd } from '@/api';
import { Message } from 'element-ui';

export default {
  props: {
    title: {
      type: String,
      default: '用户详细信息'
    },
    open: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        username: '',
        email: '',
        mobile: '',
        avatar: '',
        company: '',
        departments: '',
        job: '',
        area: '',
        addr: '',
        intro: ''
      })
    }
  },
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: '120px',
      changePwd: false,
      pwd: '',
      rePwd: '',
      loading: false
    };
  },
  methods: {
    modifiedPwd() {
      if (!this.pwd || !this.rePwd || this.pwd !== this.rePwd) {
        return Message({
          message: '请输入正确的密码',
          type: 'error',
          duration: 5 * 1000
        });
      }
      this.loading = true;
      putUserPwd({ id: this.form.id, password: this.pwd, repwd: this.rePwd })
        .then(res => {
          this.changePwd = false;
          this.loading = false;
          Message({
            message: '修改成功',
            type: 'success',
            duration: 3 * 1000
          });
        })
        .catch(e => {
          this.loading = false;
        });
    },
    close() {
      this.$emit('onClose');
    },
    modified() {
      putCompanyUserInfo(this.form)
        .then(res => this.$emit('afterDetail'))
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.form {
  overflow: auto;
  max-height: 50vh;
}
.input {
  width: 350px;
}
</style>
