<template>
  <div class="app-container">
    <div class="block">
      广告类别：
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button style="margin-left: 20px;" @click="featCate">
        新增广告类别
      </el-button>
      <el-button
        type="danger"
        style="margin-left: 20px;"
        v-if="!!currSelect"
        @click="delCate"
      >
        删除这个类别
      </el-button>
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
    <div v-else class="body2">请选择新闻类别</div>
    <!-- <questions
      v-if="!!currSelect"
      :actId="currSelect && currSelect.id"
      :key="currSelect ? currSelect.id : 'curr_'"
    ></questions> -->
    <!-- <feat-act
      v-if="featModal"
      @onClose="featModal = false"
      @afterFetch="afterFetch"
    ></feat-act> -->
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
// import FeatAct from './featAct';
// import DetailAct from './detailAct';
import FeatAdCate from './featAdCate';
import DetailAd from './detailAd';
import ads from './ads';

export default {
  components: {
    // FeatAct,
    // DetailAct,
    FeatAdCate,
    DetailAd,
    ads
  },
  data() {
    return {
      actData: [],
      parentCate: [],
      options: [],
      /*
      {
        id: 13,
        key: '1',
        name: '类别3'
      }
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
      deleteAd(this.currSelect.id)
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
      getAds(page)
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
