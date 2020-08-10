<template>
  <div class="app-container">
    <div class="block">
      <el-button style="margin-bottom: 20px;" @click="featCate">
        新增商品
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="actData.results"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="商品ID" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所需积分">
          <template slot-scope="scope">
            <span>{{ scope.row.integral }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="商品介绍">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品状态">
          <template slot-scope="scope">
            <span>{{ goodsStatusList[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销量">
          <template slot-scope="scope">
            <span>{{ scope.row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="180">
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
      <h3>商品详情：</h3>
      <detail
        :form="currSelect"
        :key="currSelect ? currSelect.id : 'curr_'"
        @afterFetch="afterDetail"
      ></detail>
    </div>
    <div v-else class="body2">请选择商品</div>

    <feat-goods
      v-if="featModal"
      @onClose="featModal = false"
      @afterFetch="afterFetch"
    />
  </div>
</template>

<script>
import { getGoods, deleteGoods } from '@/api';
import { param2Obj } from '@/utils';
import { Message } from 'element-ui';
import FeatGoods from './featGoods';
import detail from './detail';
export default {
  components: {
    FeatGoods,
    detail
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
      goodsStatusList: ['下架', '上架'],
      currSelect: undefined,
      featModal: false
    };
  },
  created() {
    this.fetchList();
  },
  watch: {
    selectValue(e) {
      this.selectChange(e);
    }
  },
  methods: {
    paginationClick() {
      if (this.listLoading) return;
      let url = type === 'next' ? this.actData.next : this.actData.previous;
      let { page } = param2Obj(url);
      this.fetchList(page);
    },
    afterFetch() {
      this.featModal = false;
      this.fetchList();
    },
    afterDetail(form) {
      this.currSelect = { ...form };
      this.fetchList();
    },
    delCate(row) {
      this.$confirm('删除商品操作无法恢复，确定吗？').then(() => {
        deleteGoods(row.id)
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
      getGoods(page)
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
