<template>
  <div class="app-container">
    <div class="block">
      <el-button style="margin-bottom: 10px;" @click="featCate">
        新增活动
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
        <el-table-column align="center" prop="created_at" label="类别介绍">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否展示" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.is_show ? '是' : '否' }}</span>
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
      <detail-act
        :form="currSelect"
        :key="currSelect ? currSelect.id : 'curr_'"
      ></detail-act>
      <el-divider></el-divider>
      <h3 class="news-wrap">答题列表：</h3>
    </div>
    <div v-else class="body2">请选择新闻类别</div>
    <questions
      v-if="!!currSelect"
      :actId="currSelect && currSelect.id"
      :key="currSelect ? currSelect.id : 'curr_'"
    ></questions>
    <feat-act
      v-if="featModal"
      @onClose="featModal = false"
      @afterFetch="afterFetch"
    ></feat-act>
  </div>
</template>

<script>
import { getActivities, deleteActivities } from '@/api';
import { param2Obj } from '@/utils';
import { Message } from 'element-ui';
import FeatAct from './featAct';
import DetailAct from './detailAct';
import questions from './questions';

export default {
  components: {
    FeatAct,
    DetailAct,
    questions
  },
  data() {
    return {
      actData: [],
      /*
      desc: "",
      id: 2,
      is_show: true,
      name: "为什么",
      */
      currSelect: undefined,
      listLoading: false,
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
        deleteActivities(row.id)
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
      getActivities({ page })
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
