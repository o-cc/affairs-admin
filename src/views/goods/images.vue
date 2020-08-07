<template>
  <div class="app-container">
    <el-button
      size="small"
      style="margin-bottom: 10px;"
      @click.native="showFeat = true"
    >
      添加商品图片
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="imgData.results"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @cell-click="cellClick"
    >
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.image_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片地址">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.image_url">图片地址</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" :gutter="10" style="margin-top:10px;">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click.native="paginationClick('prev')"
        size="small"
        :disabled="!!!imgData.previous"
      >
        上一页
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click.native="paginationClick('next')"
        :disabled="!!!imgData.next"
      >
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-row>
  </div>
</template>

<script>
import { getGoodsImg, deleteCompanyUser } from '@/api';
import { param2Obj } from '@/utils';
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  props: {
    goodsId: {
      type: Number
    }
  },
  components: {},
  data() {
    return {
      imgData: {
        count: 0,
        next: '',
        previous: '',
        results: []
      },
      listLoading: true,
      withPagination: false,
      currPage: 1,
      currUserInfo: {},
      showDetail: false,
      showFeat: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleEdit(idx, row) {
      this.cellClick(row);
    },
    handleDelete(idx, row) {
      deleteCompanyUser(row)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
        });
    },
    afterFeat() {
      this.fetchData(1);
      this.showFeat = false;
    },
    afterDetail() {
      this.fetchData(this.currPage);
      this.showDetail = false;
    },
    fetchData(page = this.currPage) {
      this.listLoading = true;
      getGoodsImg(this.goodsId, page).then(response => {
        this.imgData = {
          ...response.data
        };
        this.listLoading = false;
      });
    },
    cellClick(row, column) {
      this.currUserInfo = JSON.parse(JSON.stringify(row));
      this.showDetail = true;
    },
    paginationClick(type) {
      if (this.listLoading) return;
      let url = type === 'next' ? this.imgData.next : this.imgData.previous;
      let { page } = param2Obj(url);
      this.currPage = page;
      this.fetchData(page);
    }
  }
};
</script>
