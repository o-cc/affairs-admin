import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/companies',
    name: 'User',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'companies',
        name: 'Companies',
        component: () => import('@/views/companiesUser/index'),
        meta: { title: '企业用户', icon: 'table' }
      }
    ]
  },

  {
    path: '/news',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'News',
        component: () => import('@/views/news/index'),
        meta: { title: '新闻管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/activity',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Activity',
        component: () => import('@/views/activity/index'),
        meta: { title: '活动管理', icon: 'nested' }
      }
    ]
  },
  {
    path: '/ad',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Ad',
        component: () => import('@/views/ad/index'),
        meta: { title: '广告管理', icon: 'el-icon-bank-card' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    name: 'Goods',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-goods'
    },
    children: [
      {
        path: 'index',
        name: 'GoodsList',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品列表' }
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/index',
    name: 'Orders',
    meta: {
      title: '订单管理',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'index',
        name: 'OrderLists',
        component: () => import('@/views/orders/index'),
        meta: { title: '订单列表' }
      }
    ]
  },
  {
    path: '/online',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Online',
        component: () => import('@/views/online/index'),
        meta: { title: '直播管理', icon: 'el-icon-data-board' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
