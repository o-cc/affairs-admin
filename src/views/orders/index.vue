<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="orders.results"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column label="商品数量" width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分/金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70" align="center">
        <template slot-scope="scope">
          {{ orderStatus[scope.row.status] }}
        </template>
      </el-table-column>

      <el-table-column label="是否删除" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_delete ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="收货人名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.receiver.receiver }}
        </template>
      </el-table-column>
      <el-table-column label="收货人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.receiver.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="收货人地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.receiver.area }} {{ scope.row.receiver.address }}
        </template>
      </el-table-column>
      <el-table-column label="商品" align="center">
        <template slot-scope="scope">
          {{ scope.row.good.name }}
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          {{ scope.row.good.price }}
        </template>
      </el-table-column>
      <el-table-column label="所需积分" align="center">
        <template slot-scope="scope">
          {{ scope.row.good.integral }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最后一次更新">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text">
            修改
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
        :disabled="!!!orders.previous"
      >
        上一页
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click.native="paginationClick('next')"
        :disabled="!!!orders.next"
      >
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-row>
    <detail
      v-if="showDetail"
      @afterDetail="afterDetail"
      :form="currUserInfo"
      @onClose="showDetail = false"
      :orderStatus="orderStatus"
    />
  </div>
</template>

<script>
import { getOrders, deleteCompanyUser } from '@/api';
import { param2Obj } from '@/utils';
// import featUser from './featUser';
import detail from './detail';
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
  components: {
    detail
  },
  data() {
    return {
      orders: {
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
      showFeat: false,
      orderStatus: ['已取消', '代发货', '已发货', '已收获']
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
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
      getOrders({ page }).then(response => {
        this.orders = {
          ...response.data
        };
        this.listLoading = false;
      });
    },
    handleClick(row) {
      this.currUserInfo = JSON.parse(JSON.stringify(row));
      this.showDetail = true;
    },
    paginationClick(type) {
      if (this.listLoading) return;
      let url = type === 'next' ? this.orders.next : this.orders.previous;
      let { page } = param2Obj(url);
      this.currPage = page;
      this.fetchData(page);
    }
  }
};
</script>
