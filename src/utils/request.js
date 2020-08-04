import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import { getObjKey } from '@/utils';
import qs from 'qs';
const query = qs.parse(window.location.search.slice(1));

const baseURL = process.env.VUE_APP_BASE_API || '/api';
const baseAdmin = process.env.VUE_APP_ADMIN_BASE_API || '/admin';
// create an axios instance
const service = axios.create({
  baseURL: baseAdmin, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});

export const api = {
  instance: axios.create({
    timeout: 5000,
    baseURL,
    withCredentials: true // send cookies when cross-domain requests
  }),
  login(data) {
    return this.instance.post('/authorizations/', data);
  },
  setBaseUrl(iCode = store.getters.iCode) {
    this.instance.defaults.baseURL = `${baseURL}/${iCode}`;
  }
};

export const setUrl = (iCode = store.getters.iCode) => {
  service.defaults.baseURL = `${baseAdmin}/${iCode}`;
};

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT ' + getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    return response;
  },
  error => {
    console.log('err' + error); // for debug
    if (error.response && error.response.status === 400) {
      let data = error.response.data;

      Message({
        message: data[getObjKey(data, 0)].join(),
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
    }
    if (error.response && error.response.status === 401) {
      let errmsg = error.response.data.errmsg;
      let detail = error.response.data.detail;
      let errMsg = errmsg ? errmsg.join() : detail;
      MessageBox.confirm(errMsg, 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      });
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return Promise.reject(error);
  }
);

export default service;
