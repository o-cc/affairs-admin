<template>
  <div>
    <el-button
      type="primary"
      style="margin-bottom: 10px;"
      @click="featModal = true"
    >
      新增广告
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="questions.results"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="广告ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="广告标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="类别名称" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告地址" width="100" align="center">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.url">跳转地址</el-link>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.status ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="rowClick('editor', scope.row)">
            查看/编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="rowClick('delete', scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end" :gutter="10" style="margin-top:10px;">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click.native="paginationClick('prev')"
        size="small"
        :disabled="!!!questions.previous"
      >
        上一页
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click.native="paginationClick('next')"
        :disabled="!!!questions.next"
      >
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-row>
    <feat-ad
      v-if="featModal"
      :adId="adId"
      @fetchData="afterQuestion"
      @onClose="featModal = false"
      :form="currForm"
      :key="adId + (!currForm ? '_' : currForm.id)"
      :isModify="!!currForm"
    ></feat-ad>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getCateAds, deleteCateAds } from '@/api';
import { param2Obj } from '@/utils';
import FeatAd from './featAd';
export default {
  components: { FeatAd },
  props: {
    adId: {
      type: Number || String
    }
  },
  data() {
    return {
      featModal: false,
      listLoading: false,
      questions: {
        next: '',
        previous: '',
        results: []
      },
      currForm: undefined
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    afterQuestion() {
      this.fetchData();
      this.currForm = undefined;
      this.featModal = false;
    },
    paginationClick(type) {
      if (this.listLoading) return;
      let url = type === 'next' ? this.questions.next : this.questions.previous;
      let { page } = param2Obj(url);
      this.currPage = page;
      this.fetchData(page);
    },
    rowClick(type, row) {
      if (type === 'delete') {
        this.$confirm('是否删除该广告?')
          .then(res => {
            deleteCateAds(this.adId, row.id).then(() => {
              Message({
                message: '删除成功',
                type: 'success'
              });
              this.fetchData();
            });
          })
          .catch(e => {});
      } else if (type === 'editor') {
        this.currForm = row;
        this.featModal = true;
      }
    },
    fetchData(page = 1) {
      this.listLoading = true;
      getCateAds(this.adId, page)
        .then(res => {
          this.listLoading = false;
          this.questions = res.data;
        })
        .catch(e => {
          this.listLoading = false;
        });
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

.video {
  width: 500px;
  height: 300px;
}
.image {
  width: 150px;
  display: block;
}
</style>
