<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import service, { api, setUrl } from '@/utils/request';
import { mapActions } from 'vuex';
import { getToken } from '@/utils/auth';
import { Message } from 'element-ui';
import qs from 'qs';
const query = qs.parse(window.location.search.slice(1));

export default {
  name: 'App',
  mounted() {
    let iCode = window.location.pathname.split('/')[2];
    if (!iCode && !query.debug) {
      Message({
        message: '找不到该企业或企业不存在！',
        type: 'error',
        duration: 0,
        center: true,
        showClose: true
      });
      if (getToken()) {
        this.$router.push('/404');
      }
    }
    if (query.debug) {
      iCode = query.iCode || 'test';
    }
    api.setBaseUrl(iCode);
    setUrl(iCode);
    this.$store.dispatch('app/setICode', iCode);
  }
};
</script>
