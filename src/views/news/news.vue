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
      <el-table-column label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.status"
            @change="selectChange(scope.row)"
            :disabled="selecting"
          >
            <el-option
              v-for="item in statusOps"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
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
      <el-table-column align="center" label="操作" width="150" fixed="right">
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
import { getNewsListByCateId, deleteNews, modifyNews } from '@/api';
import FeatNews from './featNews';
import NewsDetail from './newsDetail';
import { param2Obj } from '@/utils';
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
      cellNews: {},
      statusOps: [
        { label: '审核不通过', value: 'FAIL' },
        { label: '审核中', value: 'UNDER' },
        { label: '审核通过', value: 'PASS' }
      ],
      selecting: false
    };
  },
  mounted() {
    this.fetchNewsList(this.cateId, 1);
  },
  methods: {
    selectChange(row) {
      this.selecting = true;
      //拿到图片的名字或者video的名字
      let data = { ...row };
      if (data.video_url) {
        data.video_name = data.video_url.slice(
          data.video_url.lastIndexOf('/') + 1
        );
      }
      if (data.index_image_url) {
        let url = data.index_image_url;
        data.index_image_name = url.slice(url.lastIndexOf('/') + 1);
      }

      modifyNews(this.cateId, data)
        .then(() => {
          Message({
            message: '修改成功',
            type: 'success',
            duration: 5 * 1000
          });
          this.selecting = false;
        })
        .catch(() => {
          this.selecting = false;
        });
    },
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
      let url = type === 'next' ? this.newData.next : this.newData.previous;
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
  max-width: 320px;
}
</style>
