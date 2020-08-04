<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import service, { api, setUrl } from '@/utils/request';
export default {
  name: 'App',
  mounted() {
    api.setBaseUrl();
    setUrl();
  }
};
</script>
