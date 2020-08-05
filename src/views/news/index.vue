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
      <el-divider></el-divider>
    </div>
    <div class="block detail" v-if="!!currSelectCate">
      <cateDetail
        :key="currSelectCate.id"
        :options="parentCate"
        :form="currSelectCate"
        @afterDetail="afterDetail"
      />
    </div>
    <div v-else class="body2">请选择新闻类别</div>

    <featCate
      @onClose="featCateModal = false"
      :options="parentCate"
      :open="featCateModal"
      @afterFeat="afterFeat"
    />
  </div>
</template>

<script>
import { getCategories, postCategories } from '@/api';
import { param2Obj } from '@/utils';
import featCate from './featCate';
import cateDetail from './cateDetail';

function chunk2Parent(parents, childs) {
  let finalOp = parents.map(parent => {
    let children = [];
    childs.forEach(child => {
      //有可能是三级的
      let children2 = [];

      childs.forEach(child2 => {
        if (child.parent_id === child2.id) {
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
    cateDetail
  },
  data() {
    return {
      fetchCateData: [],
      timer: null,
      featCateModal: false,
      parentCate: [],
      options: [],
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
    formatOption() {
      let parents = this.fetchCateData.filter(i => !i.parent_id);
      let childs = this.fetchCateData.filter(i => i.parent_id);
      //一级与二级的组合
      let secondLevel = chunk2Parent(parents, childs);
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
