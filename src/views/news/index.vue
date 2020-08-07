<template>
  <div class="app-container">
    <div class="block">
      新闻类别：
      <el-cascader
        :options="options"
        :props="{ checkStrictly: true }"
        clearable
        v-model="selectValues"
        @change="cascaderChange"
        @visible-change="visibleChange"
        placeholder="新闻类别"
      ></el-cascader>
      <el-button style="margin-left: 20px;" @click="featCate">
        新增类别
      </el-button>
      <el-button
        type="danger"
        style="margin-left: 20px;"
        v-if="!!currSelectCate"
        @click="delCate"
      >
        删除这个类别
      </el-button>
      <el-divider></el-divider>
    </div>
    <div class="block detail" v-if="!!currSelectCate">
      <h3>类别详情：</h3>
      <cateDetail
        :key="currSelectCate.id"
        :options="parentCate"
        :form="currSelectCate"
        @afterDetail="afterDetail"
      />
      <el-divider></el-divider>
      <h3 class="news-wrap">新闻管理：</h3>
      <news :cateId="currSelectCate.id" :key="'news_' + currSelectCate.id" />
    </div>
    <div v-else class="body2">请选择新闻类别</div>

    <featCate
      @onClose="featCateModal = false"
      :options="parentCate"
      v-if="featCateModal"
      @afterFeat="afterFeat"
    />
  </div>
</template>

<script>
import { getCategories, postCategories, deleteCate } from '@/api';
import { param2Obj } from '@/utils';
import featCate from './featCate';
import cateDetail from './cateDetail';
import news from './news';
import { Message } from 'element-ui';

function chunk2Parent(parents, childs) {
  let finalOp = parents.map(parent => {
    let children = [];
    childs.forEach(child => {
      //有可能是三级的
      let children2 = [];

      childs.forEach(child2 => {
        if (child.id === child2.parent_id) {
          children2.push({
            ...child2,
            value: child2.id,
            label: child2.name
          });
        }
      });
      children2.length > 0 && (child.children = children2);
      if (child.parent_id === parent.id) {
        children.push({
          ...child,
          value: child.id,
          label: child.name
        });
      }
    });
    //
    return {
      ...parent,
      children,
      value: parent.id,
      label: parent.name
    };
  });
  console.log('final', finalOp);

  return finalOp;
}

export default {
  components: {
    featCate,
    cateDetail,
    news
  },
  data() {
    return {
      fetchCateData: [],
      timer: null,
      featCateModal: false,
      parentCate: [],
      options: [],
      /*
       {
        id: 27,
        is_index: true,
        key: '',
        name: '后台管理测试',
        parent_id: '',
        sequence: 1
      }
      */
      currSelectCate: undefined,
      selectValues: [],
      detailKey: 0
    };
  },
  created() {
    this.getCategoiesList();
  },
  computed: {
    cateDataWithIdKey() {
      return this.fetchCateData.reduce((prev, item) => {
        prev[item.id] = item;
        return prev;
      }, {});
    }
  },
  methods: {
    afterDetail() {
      this.currSelectCate = undefined;
      this.getCategoiesList();
    },
    delCate() {
      this.$confirm('确定删除吗?')
        .then(() => {
          deleteCate(this.currSelectCate.id)
            .then(res => {
              Message({
                message: '删除成功!',
                type: 'success'
              });
              this.getCategoiesList();
              this.currSelectCate = undefined;
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    formatOption() {
      let parents = this.fetchCateData.filter(i => !i.parent_id);
      let childs = this.fetchCateData.filter(i => i.parent_id);
      //一级与二级的组合
      let secondLevel = chunk2Parent(parents, childs);
      console.log(secondLevel);
      //[]有三级和二级
      this.parentCate = secondLevel.map(item => {
        return {
          label: item.name,
          value: item.id,
          children: item.children || []
        };
      });
      this.options = secondLevel;
    },

    afterFeat() {
      this.featCateModal = false;
      this.getCategoiesList();
    },
    featCate() {
      this.featCateModal = true;
    },
    //选择类别
    cascaderChange(arr) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let id = arr[arr.length - 1];
        this.currSelectCate = this.cateDataWithIdKey[id];
        this.fetchNews();
      }, 1000);
    },
    visibleChange(tf) {},
    fetchNews() {},
    getCategoiesList(page = 1) {
      getCategories({ page })
        .then(res => {
          let data = res.data;
          if (page === 1) {
            this.fetchCateData = data.results;
          } else {
            this.fetchCateData = this.fetchCateData.concat(data.results);
          }

          if (data.next) {
            let { page } = param2Obj(data.next);
            this.getCategoiesList(page);
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
