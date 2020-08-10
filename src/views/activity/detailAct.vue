<template>
  <el-form :model="actInfo" class="form">
    <el-form-item label="活动名称" :label-width="formLabelWidth">
      <el-input
        class="input"
        v-model="actInfo.name"
        autocomplete="off"
        placeholder="活动名称"
        :disabled="!isModify"
      ></el-input>
    </el-form-item>
    <el-form-item label="活动简介" :label-width="formLabelWidth">
      <el-input
        class="input"
        type="textarea"
        v-model="actInfo.desc"
        autocomplete="off"
        :rows="4"
        placeholder="活动简介"
        :disabled="!isModify"
      ></el-input>
    </el-form-item>
    <el-form-item label="是否展示活动" :label-width="formLabelWidth">
      <el-switch v-model="actInfo.is_show" :disabled="!isModify"></el-switch>
    </el-form-item>
    <el-form-item label="修改内容" :label-width="formLabelWidth">
      <el-switch v-model="isModify"></el-switch>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" v-if="isModify">
      <el-button type="primary" size="small" @click="handleClick('cancel')">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="handleClick('modify')">
        修改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putActivities } from '@/api';
import { Message } from 'element-ui';
export default {
  props: {
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
      actInfo: {},
      isModify: false
    };
  },
  mounted() {
    this.actInfo = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    handleClick(type) {
      if (type === 'cancel') {
        this.$confirm('确认取消吗?').then(() => {
          this.actInfo = this.form;
          this.isModify = false;
        });
      } else if (type === 'modify') {
        this.$confirm('确认修改吗?').then(() => {
          putActivities(this.actInfo)
            .then(() => {
              Message({
                message: '修改成功',
                type: 'success'
              });
              this.isModify = false;
            })
            .catch(() => {});
        });
      }
    },
    close() {
      this.$emit('onClose');
    }
  }
};
</script>

<style scoped>
.input {
  max-width: 350px;
}
</style>
