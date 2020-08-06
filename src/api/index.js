import request, { api } from '@/utils/request';

export function getCompaniesUser(params) {
  return request({
    url: '/users/',
    method: 'get',
    params
  });
}

export function putCompanyUserInfo(data) {
  return request({
    url: '/users/' + data.id + '/',
    method: 'put',
    data
  });
}

export function postCompanyUser(data) {
  return request({
    url: '/users/',
    method: 'post',
    data
  });
}
//缺少删除
export function deleteCompanyUser(data) {
  return request({
    url: '/users/' + data.id + '/',
    method: 'delete'
  });
}
//不可用
export function putUserPwd(data) {
  return request({
    url: `/users/${data.id}/passwords/`,
    method: 'put',
    data
  });
}

export function getCategories(params) {
  return request({
    url: '/categories/',
    method: 'get',
    params
  });
}

export function postCategories(data) {
  return request({
    url: '/categories/',
    method: 'post',
    data
  });
}

export function putCateById(data) {
  return request({
    url: `/categories/${data.id}/`,
    method: 'put',
    data
  });
}

export function getNewsListByCateId(id, page) {
  return request({
    url: `/categories/${id}/news/`,
    method: 'get',
    params: { page }
  });
}

export function getVideoToken() {
  return api.instance({
    url: `/qiniu/tokens/`,
    method: 'get'
  });
}

export function postCategoriesNews(cateId, data) {
  return request({
    url: `/categories/${cateId}/news/`,
    method: 'post',
    data
  });
}

export function deleteNews(cateId, newId) {
  return request({
    url: `/categories/${cateId}/news/${newId}/`,
    method: 'delete'
  });
}

export function deleteCate(cateId) {
  return request({
    url: `/categories/${cateId}/`,
    method: 'delete'
  });
}

export function modifyNews(cateId, data) {
  return request({
    url: `/categories/${cateId}/news/${data.id}/`,
    method: 'put',
    data
  });
}
