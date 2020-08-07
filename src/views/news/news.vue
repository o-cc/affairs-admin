<template>
  <div>
    <el-button
      type="primary"
      style="margin-bottom: 10px;"
      @click="featModal = true"
    >
      新增新闻
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="newData.results"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="新闻ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="文章标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="文章类型" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.news_type === 'GraphText' ? '图文' : '视频' }}
        </template>
      </el-table-column>
      <el-table-column label="点击量" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.clicks }}
        </template>
      </el-table-column>
      <el-table-column label="评论量" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.comments_count }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="rowClick('editor', scope.row)">
            编辑
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
        :disabled="!!!newData.previous"
      >
        上一页
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click.native="paginationClick('next')"
        :disabled="!!!newData.next"
      >
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-row>
    <feat-news
      :cateId="cateId"
      @onClose="featModal = false"
      @afterFeat="afterFeatNews"
      v-if="featModal"
    ></feat-news>

    <news-detail
      @onClose="showDetail = false"
      :cateId="cateId"
      @afterModify="afterModifyNews"
      :form="cellNews"
      :key="cellNews.id"
      v-if="showDetail"
    ></news-detail>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getNewsListByCateId, deleteNews } from '@/api';
import FeatNews from './featNews';
import NewsDetail from './newsDetail';
import { param2Obj } from '../../../mock/utils';
export default {
  components: {
    FeatNews,
    NewsDetail
  },
  props: {
    cateId: {
      type: Number || String
    }
  },
  data() {
    return {
      listLoading: false,
      newData: {
        results: [],
        next: '',
        previous: ''
      },
      featModal: false,
      currPage: 1,
      showDetail: false,
      cellNews: {}
    };
  },
  mounted() {
    this.fetchNewsList(this.cateId, 1);
  },
  methods: {
    afterFeatNews() {
      this.featModal = false;
      this.fetchNewsList(this.cateId, this.currPage);
    },
    afterModifyNews() {
      this.showDetail = false;
      this.fetchNewsList(this.cateId, this.currPage);
    },
    paginationClick(type) {
      if (this.listLoading) return;
      url = type === 'next' ? this.newData.next : this.newData.previous;
      let { page } = param2Obj(url);
      this.currPage = page;
      this.fetchNewsList(this.cateId, page);
    },
    rowClick(type, row) {
      if (type === 'delete') {
        this.$confirm(`确定移除？`).then(() => {
          deleteNews(this.cateId, row.id)
            .then(res => {
              this.fetchNewsList(undefined, this.currPage);
            })
            .catch(() => {});
        });
      } else if (type === 'editor') {
        this.showDetail = true;
        this.cellNews = row;
      }
      console.log(type, row);
    },
    fetchNewsList(id = this.cateId, page = 1) {
      getNewsListByCateId(id, page)
        .then(({ data }) => {
          this.newData = data;
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
