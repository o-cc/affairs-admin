<template>
  <div class="app-container">
    <el-button
      size="small"
      style="margin-bottom: 10px;"
      @click.native="showFeat = true"
    >
      添加用户
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="userData.results"
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
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="积分" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.integral }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="头像" width="300">
        <template slot-scope="scope">
          {{ scope.row.avatar }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="最后登录时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.last_login }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit('editor', scope.row)">
            编辑
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
        :disabled="!!!userData.previous"
      >
        上一页
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click.native="paginationClick('next')"
        :disabled="!!!userData.next"
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
    />
    <featUser
      v-if="showFeat"
      @afterFeat="afterFeat"
      @onClose="showFeat = false"
    />
  </div>
</template>

<script>
import { getCompaniesUser, deleteCompanyUser } from '@/api';
import { param2Obj } from '@/utils';
import featUser from './featUser';
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
    detail,
    featUser
  },
  data() {
    return {
      userData: {
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
    handleEdit(type, row) {
      this.cellClick(row);
    },
    handleDelete(idx, row) {
      deleteCompanyUser(row)
        .then(res => {
          // console.log(res);
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
      getCompaniesUser({ page }).then(response => {
        this.userData = {
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
      let url = type === 'next' ? this.userData.next : this.userData.previous;
      let { page } = param2Obj(url);
      this.currPage = page;
      this.fetchData(page);
    }
  }
};
</script>
