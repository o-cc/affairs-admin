<template>
  <el-form :model="info" class="form">
    <el-form-item label="商品名称" :label-width="formLabelWidth">
      <el-input
        :disabled="!isModify"
        class="input"
        v-model="info.name"
        autocomplete="off"
        placeholder="商品名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格" :label-width="formLabelWidth">
      <el-input
        :disabled="!isModify"
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
        :disabled="!isModify"
        type="number"
        v-model="info.integral"
        autocomplete="off"
        placeholder="积分"
      ></el-input>
    </el-form-item>
    <el-form-item label="库存" :label-width="formLabelWidth">
      <el-input
        :disabled="!isModify"
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
        :disabled="!isModify"
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
        :disabled="!isModify"
        :row="4"
        placeholder="商品介绍"
      ></el-input>
    </el-form-item>
    <el-form-item label="商品状态" :label-width="formLabelWidth">
      <el-select v-model="info.status" :disabled="!isModify">
        <el-option
          v-for="item in states"
          :label="item.label"
          :value="item.value"
          :key="item.label"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="修改" :label-width="formLabelWidth">
      <el-switch v-model="isModify"></el-switch>
    </el-form-item>
    <el-form-item v-if="isModify" :label-width="formLabelWidth">
      <el-button type="primary" size="small" @click="handleClick('cancel')">
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        :isLoading="isLoading"
        @click="handleClick('modify')"
      >
        修改
      </el-button>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="商品图片" :label-width="formLabelWidth">
      <UploadImg @onSuccess="onSuccess" :limit="0" />
      <preview-img :images="info.images" @delImage="delImage"></preview-img>
    </el-form-item>
  </el-form>
</template>
<script>
import Imgs from './imgs';
import { putGoods, deleteGoodsImg, postGoodsImg } from '../../api';
import { Message } from 'element-ui';
import UploadImg from '@/components/Upload';
import PreviewImg from './components/previewImg';
export default {
  components: {
    Imgs,
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
          name: 'reregergre',
          price: 15,
          integral: 2,
          status: 1,
          desc: 'reghtehrhr',
          stock: 20,
          sales: 10,
          images: ['www.baidu.com']
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      info: {},
      isLoading: false,
      states: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      isModify: false
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
  },
  methods: {
    onSuccess(res) {
      postGoodsImg(this.info.id, { image_name: res.image_name }).then(
        ({ data }) => {
          Message({ message: '添加成功', type: 'success' });
          this.info = {
            ...this.info,
            images: this.info.images.concat({
              image_id: data.image_id,
              image_url: data.image_url
            })
          };
        }
      );
    },
    delImage(img) {
      this.$confirm('当前操作不可撤销')
        .then(() => {
          deleteGoodsImg(this.info.id, img.image_id).then(res => {
            Message({
              message: '操作成功',
              type: 'success'
            });

            this.info = {
              ...this.info,
              images: this.info.images.filter(i => i.image_id !== img.image_id)
            };
          });
        })
        .catch(() => {});
    },
    handleClick(type) {
      if (type === 'cancel') {
        this.$confirm('确认取消吗?').then(() => {
          this.info = JSON.parse(JSON.stringify(this.form));
        });
        return;
      }
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
      this.isLoading = true;
      let data = { ...this.info };
      delete data.images;
      putGoods(data)
        .then(() => {
          Message({ message: '修改成功', type: 'success' });
          this.$emit('afterFetch', this.info);
          this.isLoading = false;
          this.isModify = false;
        })
        .catch(e => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.input {
  width: 350px;
}
</style>
