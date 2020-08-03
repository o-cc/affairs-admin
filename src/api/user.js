import request from '@/utils/request';
import { defaultAvatar } from '@/config';

export function login(data) {
  return request({
    url: '/test/authorizations/',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    let data = {
      username: window.sessionStorage.getItem('name') || 'admin',
      avatar: defaultAvatar
    };
    return resolve(data);
  });
}
