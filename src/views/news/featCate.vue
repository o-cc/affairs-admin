<template>
  <el-dialog title="添加分类" :visible.sync="open" :before-close="close">
    <el-form :model="form" class="form">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.name"
          autocomplete="off"
          placeholder="类别名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="父类别" :label-width="formLabelWidth">
        <el-cascader
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
          @change="cascaderChange"
          placeholder="新闻类别"
        ></el-cascader>
        <span style="font-size: 12px; color: #ccc; margin-left: 5px;">
          添加父类，请忽略此项
        </span>
      </el-form-item>
      <el-form-item label="是否显示在首页" :label-width="formLabelWidth">
        <el-switch
          v-model="form.is_index"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-form-item>
      <el-form-item label="类别标识" :label-width="formLabelWidth">
        <el-input
          class="input"
          placeholder="类别标识"
          v-model="form.key"
        ></el-input>
      </el-form-item>
      <el-form-item label="该类别顺序" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.sequence"
          placeholder="该类别顺序"
          type="number"
        ></el-input>
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
import { Message } from 'element-ui';
import { postCategories } from '@/api';

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        name: '',
        parent_id: undefined,
        sequence: 1,
        is_index: false,
        key: undefined
      }
    };
  },
  methods: {
    feat() {
      if (!this.form.name) {
        return Message({
          message: '请输入类别名称',
          type: 'error',
          duration: 5 * 1000
        });
      }
      console.log('form', this.form);
      postCategories(this.form)
        .then(res => {
          this.$emit('afterFeat');
        })
        .catch(e => {});
    },
    cascaderChange(val) {
      console.log('val', val);
      this.form = {
        ...this.form,
        parent_id: val[0]
      };
    },
    close() {
      this.$emit('onClose');
    }
  }
};
</script>

<style scoped>
.input {
  width: 320px;
}
</style>
