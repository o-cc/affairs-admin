<template>
  <el-dialog title="添加商品信息" :visible.sync="open" :before-close="close">
    <el-form :model="info" class="form">
      <el-form-item label="商品名称" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.name"
          autocomplete="off"
          placeholder="商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="number"
          v-model="info.price"
          autocomplete="off"
          placeholder="价格"
        ></el-input>
      </el-form-item>
      <el-form-item label="所需积分" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="number"
          v-model="info.integral"
          autocomplete="off"
          placeholder="积分"
        ></el-input>
      </el-form-item>
      <el-form-item label="库存" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="number"
          v-model="info.stock"
          autocomplete="off"
          placeholder="库存"
        ></el-input>
      </el-form-item>
      <el-form-item label="销量" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="number"
          v-model="info.sales"
          autocomplete="off"
          placeholder="销量"
        ></el-input>
      </el-form-item>
      <el-form-item label="介绍" :label-width="formLabelWidth">
        <el-input
          class="input"
          type="textarea"
          v-model="info.desc"
          autocomplete="off"
          :row="4"
          placeholder="商品介绍"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品状态" :label-width="formLabelWidth">
        <el-select v-model="info.status">
          <el-option
            v-for="item in states"
            :label="item.label"
            :value="item.value"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片" :label-width="formLabelWidth">
        <upload-img
          :limit="null"
          @removeImg="removeImg"
          @onSuccess="onSuccess"
        ></upload-img>
        <preview-img
          @delImage="removeImg"
          :images="this.info.images"
        ></preview-img>
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
import { postGoods } from '@/api';
import { Message } from 'element-ui';
import UploadImg from '@/components/Upload';
import PreviewImg from './components/previewImg';

export default {
  components: {
    UploadImg,
    PreviewImg
  },
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
          price: 0,
          integral: 0,
          status: 1,
          desc: '',
          stock: 0,
          sales: 0,
          image_names: [],
          images: []
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
      info: {},
      states: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ]
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    removeImg(res) {
      this.info = {
        ...this.info,
        image_names: this.info.image_names.filter(i => i !== res.image_name),
        images: this.info.images.filter(i => i.image_name !== res.image_name)
      };
    },
    onSuccess(res) {
      if (this.info.image_names.some(i => i === res.image_name)) {
        Message({ message: '上传成功，但当前已存在该图片' });
        return;
      }
      this.info = {
        ...this.info,
        image_names: this.info.image_names.concat(res.image_name),
        images: this.info.images.concat({
          image_id: this.info.images.length,
          image_url: res.image_url,
          image_name: res.image_name
        })
      };
    },
    close() {
      this.$emit('onClose');
    },
    feat() {
      let error = '';
      if (!this.info.name) {
        error = '请输入名称';
      } else if (!this.info.price) {
        error = '请输入价格';
      } else if (!this.info.integral) {
        error = '请输入积分';
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }

      postGoods(this.info)
        .then(() => {
          Message({ message: '添加成功', type: 'success' });
          this.$emit('afterFetch');
        })
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
