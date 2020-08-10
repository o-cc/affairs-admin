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

export function deleteQuestion(actId, id) {
  return request({
    url: `/activities/${actId}/questions/${id}/`,
    method: 'delete'
  });
}

export function getAds(page) {
  return request({
    url: `/content_categories/`,
    method: 'get',
    params: { page }
  });
}

export function postAd(data) {
  return request({
    url: `/content_categories/`,
    method: 'post',
    data
  });
}

export function deleteAd(id) {
  return request({
    url: `/content_categories/${id}/`,
    method: 'delete'
  });
}

export function putAd(data) {
  return request({
    url: `/content_categories/${data.id}/`,
    method: 'put',
    data
  });
}

export function getCateAds(id, page) {
  return request({
    url: `/categories/${id}/contents/`,
    method: 'get',
    params: { page }
  });
}

export function postCateAds(id, data) {
  return request({
    url: `/categories/${id}/contents/`,
    method: 'post',
    data
  });
}

export function deleteCateAds(id, cid) {
  return request({
    url: `/categories/${id}/contents/${cid}/`,
    method: 'delete'
  });
}

export function putCateAds(id, data) {
  return request({
    url: `/categories/${id}/contents/${data.id}/`,
    method: 'put',
    data
  });
}

export function getGoods(page) {
  return request({
    url: `/goods/`,
    method: 'get',
    params: { page }
  });
}

export function postGoods(data) {
  return request({
    url: `/goods/`,
    method: 'post',
    data
  });
}

export function putGoods(data) {
  return request({
    url: `/goods/${data.id}/`,
    method: 'put',
    data
  });
}

export function deleteGoods(id) {
  return request({
    url: `/goods/${id}/`,
    method: 'delete'
  });
}

export function getGoodsImg(id, page) {
  return request({
    url: `/goods/${id}/images/`,
    method: 'get',
    params: { page }
  });
}

export function deleteGoodsImg(id, imgId) {
  return request({
    url: `/goods/${id}/images/${imgId}/`,
    method: 'delete'
  });
}

export function postGoodsImg(id, data) {
  return request({
    url: `/goods/${id}/images/`,
    method: 'post',
    data
  });
}

export function getOrders(params) {
  return request({
    url: `/orders/`,
    method: 'get',
    params
  });
}

export function putOrders(data) {
  return request({
    url: `/orders/${data.id}/`,
    method: 'put',
    data
  });
}
