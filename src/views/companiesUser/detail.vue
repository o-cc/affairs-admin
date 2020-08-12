<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" :before-close="close">
      <el-form :model="userData" class="form">
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
            v-model="userData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input
            class="input"
            type="number"
            v-model="userData.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input
            class="input"
            type="email"
            v-model="userData.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.integral"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <uploadImg @onSuccess="imgUpSuccess" :limit="null" />
          <el-image
            style="width: 100px; height: 100px"
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
          ></el-image>
          <!-- <el-input class="input" v-model="userData.avatar"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.addr"></el-input>
        </el-form-item>
        <el-form-item label="区域" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.area"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.company"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.departments"></el-input>
        </el-form-item>
        <el-form-item label="职业" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.job"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input class="input" v-model="userData.intro"></el-input>
        </el-form-item>
        <el-form-item label="是否活跃" :label-width="formLabelWidth">
          <el-switch v-model="userData.is_active"></el-switch>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth">
          <el-switch v-model="userData.is_admin"></el-switch>
        </el-form-item>
        <el-form-item label="最后一次登录" :label-width="formLabelWidth">
          <el-input
            class="input"
            v-model="userData.last_login"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <el-input
            class="input"
            v-model="userData.date_joined"
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
import uploadImg from '@/components/Upload';

export default {
  props: {
    title: {
      type: String,
      default: '用户详细信息'
    },
    open: {
      type: Boolean,
      default: true
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
  components: {
    uploadImg
  },
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: '120px',
      changePwd: false,
      pwd: '',
      rePwd: '',
      loading: false,
      userData: {},
      imgUrl: ''
    };
  },
  mounted() {
    this.userData = { ...this.form };
    this.imgUrl = this.userData.avatar;
  },
  methods: {
    imgUpSuccess(res) {
      this.imgUrl = res.image_url;
      this.userData = {
        ...this.userData,
        avatar_name: res.image_name,
        avatar: res.image_url
      };
    },
    modifiedPwd() {
      if (!this.pwd || !this.rePwd || this.pwd !== this.rePwd) {
        return Message({
          message: '请输入正确的密码',
          type: 'error',
          duration: 5 * 1000
        });
      }
      this.loading = true;
      putUserPwd({
        id: this.userData.id,
        password: this.pwd,
        repwd: this.rePwd
      })
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
      putCompanyUserInfo(this.userData)
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
  max-width: 350px;
}
</style>
