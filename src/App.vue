<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { api } from '@/utils/request';
export default {
  name: 'App',
  mounted() {
    api.setBaseUrl();
  }
};
</script>
