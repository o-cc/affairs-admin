<template>
  <el-form :model="currForm" class="form">
    <el-form-item label="名称" :label-width="formLabelWidth">
      <el-input
        class="input"
        v-model="currForm.name"
        autocomplete="off"
        placeholder="类别名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="父新闻类别" :label-width="formLabelWidth">
      <el-cascader
        :options="options"
        :props="{ checkStrictly: true }"
        clearable
        v-model="currForm.parent_id"
        placeholder="新闻类别"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="是否显示在首页" :label-width="formLabelWidth">
      <el-switch
        v-model="currForm.is_index"
        active-color="#13ce66"
        inactive-color="#ff4949"
      ></el-switch>
    </el-form-item>
    <el-form-item label="类别标识" :label-width="formLabelWidth">
      <el-input
        class="input"
        placeholder="类别标识"
        v-model="currForm.key"
      ></el-input>
    </el-form-item>
    <el-form-item label="该类别顺序" :label-width="formLabelWidth">
      <el-input
        class="input"
        v-model="currForm.sequence"
        placeholder="该类别顺序"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="类别修改" :label-width="formLabelWidth">
      <el-switch
        v-model="modify"
        active-color="#13ce66"
        inactive-color="#ff4949"
      ></el-switch>
    </el-form-item>
    <el-form-item v-if="modify" :label-width="formLabelWidth">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="comfrim">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Message } from 'element-ui';
import { putCateById } from '@/api';

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        parent_id: undefined,
        sequence: 1,
        is_index: false,
        key: undefined
      })
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      modify: false,
      isCancel: false,
      currForm: {},
      values: [],
      cascaderValues: []
    };
  },
  mounted() {
    this.currForm = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    comfrim() {
      if (!this.currForm.name || !this.currForm.sequence) {
        return Message({
          message: '名称和类别顺序是必须的',
          type: 'error'
        });
      }
      this.$confirm('是否确认修改?', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          let parent_id = this.currForm.parent_id;
          if (typeof this.currForm.parent_id === 'object') {
            parent_id = parent_id[parent_id.length - 1];
          }
          let data = {
            ...this.currForm,
            parent_id: parent_id
          };
          putCateById(data).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.$emit('afterDetail');
            this.modify = false;
          });
        })
        .catch(() => {});
    },
    cancel() {
      this.$confirm('该操作会放弃修改的内容?', '放弃修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.currForm = JSON.parse(JSON.stringify(this.form));
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.input {
  width: 320px;
}
</style>
