<template>
  <el-dialog
    title="添加新闻"
    fullscreen="fullscreen"
    :visible.sync="open"
    :before-close="close"
    center
  >
    <el-form :model="form" class="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.title"
          autocomplete="off"
          placeholder="新闻标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="新闻类型" :label-width="formLabelWidth">
        <el-select v-model="form.news_type" placeholder="请选择">
          <el-option
            v-for="item in newTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章作者" :label-width="formLabelWidth">
        <el-select v-model="form.author_id" placeholder="请选择">
          <el-option
            v-for="item in authorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" :label-width="formLabelWidth">
        <uploadImg @onSuccess="imgUpSuccess" />
      </el-form-item>
      <el-form-item label="新闻状态" :label-width="formLabelWidth">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in newStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.status === 'FAIL'"
        label="不通过原因"
        :label-width="formLabelWidth"
      >
        <el-input
          class="input"
          v-model="form.reason"
          placeholder="原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="点击数量" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.clicks"
          placeholder="点击量"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="评论数量" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="form.comments_count"
          placeholder="评论数量"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.news_type === 'GraphText'"
        label="文章内容"
        :label-width="formLabelWidth"
      >
        <tinymce v-model="form.content" :height="300" />
      </el-form-item>
      <el-form-item
        v-if="form.news_type === 'GraphText'"
        label="文章摘要"
        :label-width="formLabelWidth"
      >
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入摘要"
          v-model="form.digest"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.news_type === 'Video'"
        label="上传视频"
        :label-width="formLabelWidth"
      >
        <upLoadVideo @onSuccess="videoUpSuccess" />
      </el-form-item>
      <el-form-item
        v-if="form.news_type === 'Video'"
        label="视频介绍"
        :label-width="formLabelWidth"
      >
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入视频简要介绍"
          v-model="form.video_dec"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.news_type === 'Video'"
        label="视频时长"
        :label-width="formLabelWidth"
      >
        <el-input
          placeholder="请输入视频时长"
          type="number"
          v-model="form.video_long"
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
import { postCategoriesNews } from '@/api';
import uploadImg from '@/components/Upload';
import Tinymce from '@/components/Tinymce';
import upLoadVideo from '@/components/Upload/uploadVideo';
export default {
  components: {
    uploadImg,
    Tinymce,
    upLoadVideo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    cateId: {
      type: Number || String
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        title: '',
        news_type: 'GraphText',
        index_image_name: '',
        status: '',
        reason: '',
        author_id: '',
        clicks: 0,
        comments_count: 0
      },
      newTypes: [
        { value: 'GraphText', label: '图文' },
        { value: 'Video', label: '视频' }
      ],
      authorList: [{ value: 3, label: '作者1' }],
      uploadImgData: {
        image_name: '',
        image_url: ''
      },
      newStatus: [
        { value: 'FAIL', label: '审核不通过' },
        { value: 'UNDER', label: '审核中' },
        { value: 'PASS', label: '审核通过' }
      ],
      newType: 'GraphText',
      newState: 'UNDER',
      content: ''
    };
  },
  methods: {
    videoUpSuccess(url) {
      console.log('videoUrl', url);
    },
    imgUpSuccess(res) {
      console.log('response', res);
      this.form = {
        ...this.form,
        index_image_name: res.image_name
      };
    },
    feat() {
      console.log(this.form);
      let error = '';
      if (!this.form.title) {
        error = '新闻标题不能为空!';
      } else if (!this.form.index_image_name) {
        error = '新闻文章封面图片不能为空';
      } else if (
        !this.form.author_id &&
        typeof this.form.author_id !== 'number'
      ) {
        error = '请选择新闻作者';
      }
      if (error) {
        return Message({
          message: error,
          type: 'error'
        });
      }
      postCategoriesNews(this.cateId, this.form)
        .then(res => {
          Message({
            message: '添加成功',
            type: 'success'
          });
          this.$emit('afterFeat');
        })
        .catch(() => {});
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
