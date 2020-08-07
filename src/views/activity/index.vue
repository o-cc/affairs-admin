<template>
  <div class="app-container">
    <div class="block">
      活动类别：
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button style="margin-left: 20px;" @click="featCate">
        新增活动
      </el-button>
      <el-button
        type="danger"
        style="margin-left: 20px;"
        v-if="!!currSelect"
        @click="delCate"
      >
        删除这个活动
      </el-button>
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
      <!-- <news :cateId="currSelect.id" :key="'news_' + currSelect.id" /> -->
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
      parentCate: [],
      options: [],
      /*
      desc: "",
      id: 2,
      is_show: true,
      name: "为什么",
      */
      currSelect: undefined,
      selectValue: '',
      detailKey: 0,
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
  computed: {
    actDataWithIdKey() {
      return this.actData.reduce((prev, item) => {
        prev[item.id] = item;
        return prev;
      }, {});
    }
  },
  methods: {
    afterFetch() {
      this.featModal = false;
      this.fetchList();
    },
    afterDetail() {
      this.currSelect = undefined;
      this.fetchList();
    },
    delCate() {
      deleteActivities(this.currSelect.id)
        .then(res => {
          Message({
            message: '删除成功!',
            type: 'success'
          });
          this.currSelect = undefined;
          this.selectValue = '';
          this.fetchList();
        })
        .catch(() => {});
    },

    formatOption() {
      this.options = this.actData.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    },
    featCate() {
      this.featModal = true;
    },
    //选择类别
    selectChange(val) {
      this.currSelect = this.actDataWithIdKey[val];
    },
    fetchList(page = 1) {
      getActivities({ page })
        .then(res => {
          let data = res.data;
          if (page === 1) {
            this.actData = data.results;
          } else {
            this.actData = this.actData.concat(data.results);
          }

          if (data.next) {
            let { page } = param2Obj(data.next);
            this.fetchList(page);
          } else {
            this.formatOption();
          }
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
