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

export function getActivities({ page }) {
  return request({
    url: '/activities/',
    method: 'get',
    params: { page }
  });
}

export function postActivities(data) {
  return request({
    url: '/activities/',
    method: 'post',
    data
  });
}

export function putActivities(data) {
  return request({
    url: `/activities/${data.id}/`,
    method: 'put',
    data
  });
}

export function deleteActivities(id) {
  return request({
    url: `/activities/${id}/`,
    method: 'delete'
  });
}

export function getQuestions(actId, page) {
  return request({
    url: `/activities/${actId}/questions/`,
    method: 'get',
    params: { page }
  });
}

export function postQuestion(actId, data) {
  return request({
    url: `/activities/${actId}/questions/`,
    method: 'post',
    data
  });
}

export function putQuestion(actId, data) {
  return request({
    url: `/activities/${actId}/questions/${data.id}/`,
    method: 'put',
    data
  });
}
