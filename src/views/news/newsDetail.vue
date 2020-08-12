<template>
  <el-dialog
    title="新闻详情"
    fullscreen="fullscreen"
    :visible.sync="open"
    :before-close="close"
    center
  >
    <el-form :model="detail" class="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="detail.title"
          autocomplete="off"
          placeholder="新闻标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="新闻类型" :label-width="formLabelWidth">
        <el-select v-model="detail.news_type" placeholder="请选择">
          <el-option
            v-for="item in newTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章作者" :label-width="formLabelWidth">
        <el-select v-model="detail.author_id" placeholder="请选择">
          <el-option
            v-for="item in authorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" :label-width="formLabelWidth">
        <uploadImg :limit="null" @onSuccess="imgUpSuccess" />
        <el-row>
          <div class="demo-image__placeholder image">
            <div class="block">
              <el-image :src="detail.index_image_url">
                <div slot="placeholder" class="image-slot">
                  封面
                  <span class="dot">...</span>
                </div>
              </el-image>
            </div>
          </div>
        </el-row>
      </el-form-item>
      <el-form-item label="新闻状态" :label-width="formLabelWidth">
        <el-select v-model="detail.status" placeholder="请选择">
          <el-option
            v-for="item in newStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="detail.status === 'FAIL'"
        label="不通过原因"
        :label-width="formLabelWidth"
      >
        <el-input
          class="input"
          v-model="detail.reason"
          placeholder="原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="点击数量" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="detail.clicks"
          placeholder="点击量"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="评论数量" :label-width="formLabelWidth">
        <el-input
          class="input"
          v-model="detail.comments_count"
          placeholder="评论数量"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="detail.news_type === 'GraphText'"
        label="文章内容"
        :label-width="formLabelWidth"
      >
        <tinymce v-model="detail.content" :height="300" />
      </el-form-item>
      <el-form-item
        v-if="detail.news_type === 'GraphText'"
        label="文章摘要"
        :label-width="formLabelWidth"
      >
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入摘要"
          v-model="detail.digest"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="detail.news_type === 'Video'"
        label="上传视频"
        :label-width="formLabelWidth"
      >
        <upLoadVideo @onSuccess="videoUpSuccess" />
        <video
          v-if="detail.video_url"
          controls
          preload
          :src="detail.video_url"
          class="video"
        ></video>
      </el-form-item>
      <el-form-item
        v-if="detail.news_type === 'Video'"
        label="视频介绍"
        :label-width="formLabelWidth"
      >
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入视频简要介绍"
          v-model="detail.video_dec"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="detail.news_type === 'Video'"
        label="视频时长"
        :label-width="formLabelWidth"
      >
        <el-input
          placeholder="请输入视频时长"
          type="number"
          v-model="detail.video_long"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="feat">
        修改
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { modifyNews } from '@/api';
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
      default: true
    },
    cateId: {
      type: Number || String
    },
    form: {
      type: Object,
      default() {
        return {
          title: '',
          news_type: 'GraphText',
          index_image_name: '',
          status: '',
          reason: '',
          author_id: '',
          clicks: 0,
          comments_count: 0
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      newTypes: [
        { value: 'GraphText', label: '图文' },
        { value: 'Video', label: '视频' }
      ],
      authorList: [],
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
      content: '',
      detail: {
        title: '',
        news_type: 'GraphText',
        index_image_name: '',
        status: '',
        reason: '',
        author_id: '',
        clicks: 0,
        comments_count: 0
      }
    };
  },
  mounted() {
    this.detail = { ...this.form };
    if (this.form.author_id && this.form.author) {
      this.authorList = [
        { label: this.form.author, value: this.form.author_id }
      ];
    }
  },
  methods: {
    videoUpSuccess(url) {
      console.log('videoUrl', url);
      this.detail = {
        ...this.detail,
        video_name: url.slice(url.lastIndexOf('/') + 1),
        video_url: url
      };
    },
    imgUpSuccess(res) {
      this.detail = {
        ...this.detail,
        index_image_name: res.image_name,
        index_image_url: res.image_url
      };
    },
    feat() {
      let data = { ...this.detail };
      let error = '';
      if (data.index_image_url) {
        let url = data.index_image_url;
        data.index_image_name = url.slice(url.lastIndexOf('/') + 1);
      }

      if (data.video_url) {
        data.video_name = data.video_url.slice(
          data.video_url.lastIndexOf('/') + 1
        );
      }

      if (!data.title) {
        error = '新闻标题不能为空';
      } else if (!data.index_image_name) {
        error = '新闻文章封面图片不能为空';
      }
      if (error) {
        return Message({
          message: error,
          type: 'error'
        });
      }

      modifyNews(this.cateId, data)
        .then(res => {
          Message({
            message: '修改成功',
            type: 'success'
          });
          this.$emit('afterModify');
        })
        .catch(() => {});
    },
    cascaderChange(val) {
      this.detail = {
        ...this.detail,
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
  max-width: 320px;
}

.video {
  width: 500px;
  height: 300px;
}
.image {
  width: 150px;
  display: block;
}
</style>
