<template>
  <el-dialog
    :title="isModify ? '问题详情' : '新增广告'"
    :visible.sync="open"
    :before-close="close"
  >
    <el-form :model="info" class="form">
      <el-form-item label="广告标题" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.title"
          autocomplete="off"
          placeholder="广告标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.url"
          autocomplete="off"
          placeholder="广告跳转地址"
        ></el-input>
      </el-form-item>

      <el-form-item label="封面图片" :label-width="formLabelWidth">
        <uploadImg @onSuccess="imgUpSuccess" />
        <el-row>
          <div class="demo-image__placeholder image">
            <div class="block">
              <el-image :src="imgUrl" style="min-width: 100%;"></el-image>
            </div>
          </div>
        </el-row>
      </el-form-item>
      <el-form-item label="广告内容" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.text"
          autocomplete="off"
          placeholder="广告内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="广告顺序" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="info.sequence"
          autocomplete="off"
          placeholder="顺序"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="是否显示" :label-width="formLabelWidth">
        <el-switch v-model="info.status"></el-switch>
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
import { postCateAds, putCateAds } from '@/api';
import { Message } from 'element-ui';
import uploadImg from '@/components/Upload';
export default {
  components: {
    uploadImg
  },
  props: {
    isModify: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: true
    },
    adId: {
      type: Number
    },
    form: {
      type: Object,
      default() {
        return {
          title: '',
          url: '',
          image_name: '',
          sequence: 1,
          text: '',
          status: true
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      info: {},
      imgUrl: ''
    };
  },
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.form));
    if (this.form.image) {
      this.imgUrl = this.form.image;
    }
  },
  methods: {
    imgUpSuccess(res) {
      this.imgUrl = res.image_url;
      this.info = {
        ...this.info,
        image_name: res.image_name
      };
    },

    close() {
      this.$emit('onClose');
    },
    feat() {
      let error = '';
      let data = { ...this.info };
      if (!data.title) {
        error = '请输入标题';
      } else if (!data.url) {
        error = '请输入广告链接';
      } else if (!data.sequence) {
        error = '请输入广告排列顺序';
      }

      if (error) {
        return Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        });
      }
      // console.log(data);
      if (this.isModify) {
        putCateAds(this.adId, data)
          .then(() => {
            Message({
              message: '修改成功',
              type: 'success'
            });
            this.$emit('fetchData');
          })
          .catch(e => {});
        return;
      }
      postCateAds(this.adId, data)
        .then(() => {
          Message({
            message: '添加成功',
            type: 'success'
          });
          this.$emit('fetchData');
        })
        .catch(e => {});
    }
  }
};
</script>

<style scoped>
.input {
  max-width: 350px;
}

.remove {
  font-size: 14px;
  color: #999;
  user-select: none;
  margin-left: 30px;
  cursor: pointer;
}
.remove:hover {
  color: red;
}

.prompt {
  color: #aaa;
  font-size: 14px;
  margin-left: 15px;
}

.image {
  width: 150px;
}
</style>
