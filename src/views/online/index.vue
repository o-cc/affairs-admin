<template>
  <div class="app-container">
    <div class="block">
      <el-button style="margin-bottom: 20px;" @click="featCate">新增直播</el-button>

      <el-table
        v-loading="listLoading"
        :data="liveData.results"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="编号" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="外链">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="封面图片" width="200">
          <template slot-scope="scope">
            <el-link type="primary" :href="scope.row.image" target="__bank">查看封面</el-link>
            <!-- <span>{{ scope.row.image_name }}</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="editor(scope.row)">查看/编辑</el-button>
            <el-button type="danger" size="mini" @click="delCate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" :gutter="10" style="margin-top:10px;">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          @click.native="paginationClick('prev')"
          size="small"
          :disabled="!!!liveData.previous"
        >上一页</el-button>

        <el-button
          type="primary"
          size="small"
          @click.native="paginationClick('next')"
          :disabled="!!!liveData.next"
        >
          下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-row>
      <el-divider></el-divider>
    </div>

    <LiveModal
      :form="currSelect"
      v-if="modal"
      :isModify="isModify"
      @onClose="modal = false"
      @fetchData="afterFetch"
    />
  </div>
</template>

<script>
import { getLives, deleteLives } from '@/api';
import { param2Obj } from '@/utils';
import { Message } from 'element-ui';
import LiveModal from './LiveModal';

export default {
  components: {
    LiveModal
  },
  data() {
    return {
      liveData: [],
      listLoading: false,
      modalKey: 0,
      currSelect: undefined,
      modal: false,
      isModify: false
    };
  },
  created() {
    this.fetchList();
  },

  methods: {
    paginationClick(type) {
      if (this.listLoading) return;
      let url = type === 'next' ? this.liveData.next : this.liveData.previous;
      let { page } = param2Obj(url);
      this.fetchList(page);
    },
    afterFetch() {
      this.modal = false;
      this.fetchList();
    },
   
    delCate(row) {
      this.$confirm('删除后不可恢复是否确认？').then(() => {
        deleteLives(row.id)
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
      this.modal = true;
      this.currSelect = undefined;
      this.isModify = false;
    },
    //选择类别
    editor(row) {
      this.modal = true;
      this.isModify = true;
      this.currSelect = row;
    },
    fetchList(page = 1) {
      getLives(page)
        .then(res => {
          let data = res.data;
          this.liveData = data;
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
