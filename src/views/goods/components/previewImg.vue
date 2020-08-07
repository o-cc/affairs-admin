<template>
  <div class="imgs-wrap" v-if="images && images.length > 0">
    <div class="preview">点击图片可预览</div>
    <div class="imgs" v-for="item in images" :key="item.image_id">
      <el-image
        style="width: auto; height: 100px;"
        :src="item.image_url"
        :preview-src-list="[item.image_url]"
      ></el-image>
      <el-row
        type="flex"
        justify="center"
        style="cursor: pointer;"
        @click.native="delImage(item)"
      >
        <i class="el-icon-delete"></i>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    images: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    delImage(item) {
      this.$emit('delImage', item);
    }
  }
};
</script>
<style lang="scss" scoped>
.imgs-wrap {
  width: 100%;
}
.imgs {
  width: 100px;
  height: 100px;
  display: inline-block;
  margin-left: 10px;
}

.preview {
  color: #999;
  font-size: 14px;
}
</style>
