<template>
  <div>
    <el-dialog
      title="修改订单只支持修改订单状态"
      :visible.sync="open"
      :before-close="close"
    >
      <el-form :model="form" class="form">
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <el-select v-model="form.status">
            <el-option
              v-for="(item, idx) in orderStatus"
              :key="item"
              :label="item"
              :value="idx"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="modified">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putCompanyUserInfo, putUserPwd, putOrders } from '@/api';
import { Message } from 'element-ui';

export default {
  props: {
    open: {
      type: Boolean,
      default: true
    },
    orderStatus: {
      type: Array,
      default() {
        return [];
      }
    },
    form: {
      type: Object,
      default: () => ({})
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
    modified() {
      putOrders({ id: this.form.id, status: this.form.status });
      this.$emit('afterDetail');
    },
    close() {
      this.$emit('onClose');
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
