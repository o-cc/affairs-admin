<template>
  <div>
    <uploadImg @onSuccess="onSuccess" />
    <el-table
      class="table"
      v-loading="listLoading"
      :data="lists"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片地址">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row">
            {{ scope.row }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delUrl(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getGoodsImg, deleteCompanyUser } from '@/api';
import { param2Obj } from '@/utils';
import uploadImg from '@/components/Upload';

export default {
  components: {
    uploadImg
  },
  props: {
    lists: {
      type: Array,
      default() {
        return ['https://www.baidu.com'];
      }
    }
  },
  data() {
    return {
      listLoading: false
    };
  },
  methods: {
    onSuccess(res) {
      this.$emit('uploadImg', res);
    },
    delUrl(row) {
      this.$emit('delImage', row);
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  width: 500px;
}
</style>
