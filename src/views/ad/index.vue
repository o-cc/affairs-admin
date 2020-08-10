<template>
  <div class="app-container">
    <div class="block">
      <el-button style="margin-bottom: 20px;" @click="featCate">
        新增广告类别
      </el-button>

      <el-table
        v-loading="listLoading"
        :data="actData.results"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="类别ID" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别名称" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别识别键">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="editor(scope.row)">
              查看/编辑
            </el-button>
            <el-button type="danger" size="mini" @click="delCate(scope.row)">
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
          :disabled="!!!actData.previous"
        >
          上一页
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click.native="paginationClick('next')"
          :disabled="!!!actData.next"
        >
          下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-row>
      <el-divider></el-divider>
    </div>
    <div class="block detail" v-if="!!currSelect">
      <h3>类别详情：</h3>
      <detail-ad
        :form="currSelect"
        :key="currSelect ? currSelect.id : 'curr_'"
      ></detail-ad>
      <el-divider></el-divider>
      <h3 class="news-wrap">答题列表：</h3>
      <!-- <news :cateId="currSelect.id" :key="'news_' + currSelect.id" /> -->
      <ads :adId="currSelect.id" :key="'news_' + currSelect.id" />
    </div>
    <div v-else class="body2">请选择广告类别</div>

    <FeatAdCate
      v-if="featModal"
      @onClose="featModal = false"
      @afterFetch="afterFetch"
    />
  </div>
</template>

<script>
import { getAds, deleteAd } from '@/api';
import { param2Obj } from '@/utils';
import { Message } from 'element-ui';
import FeatAdCate from './featAdCate';
import DetailAd from './detailAd';
import ads from './ads';

export default {
  components: {
    FeatAdCate,
    DetailAd,
    ads
  },
  data() {
    return {
      actData: [],
      listLoading: false,
      /*
      {
        id: 13,
        key: '1',
        name: '类别3'
      }
      */
      currSelect: undefined,
      featModal: false
    };
  },
  created() {
    this.fetchList();
  },

  methods: {
    paginationClick(type) {
      if (this.listLoading) return;
      let url = type === 'next' ? this.actData.next : this.actData.previous;
      let { page } = param2Obj(url);
      this.fetchList(page);
    },
    afterFetch() {
      this.featModal = false;
      this.fetchList();
    },
    afterDetail() {
      this.currSelect = undefined;
      this.fetchList();
    },
    delCate(row) {
      this.$confirm('删除后不可恢复是否确认？').then(() => {
        deleteAd(row.id)
          .then(res => {
            Message({
              message: '删除成功!',
              type: 'success'
            });
            this.currSelect = undefined;
            this.fetchList();
          })
          .catch(() => {});
      });
    },
    featCate() {
      this.featModal = true;
    },
    //选择类别
    editor(row) {
      this.currSelect = row;
    },
    fetchList(page = 1) {
      getAds(page)
        .then(res => {
          let data = res.data;
          this.actData = data;
        })
        .catch(e => {});
    }
  }
};
</script>

<style scoped>
.detail {
  margin-top: 30px;
}
</style>
