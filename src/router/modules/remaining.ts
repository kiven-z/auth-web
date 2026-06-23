import { $t } from '@/plugins/i18n';

const Layout = () => import('@/layout/index.vue');

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/home/login/index.vue'),
    meta: {
      title: $t('menus.pureLogin'),
      showLink: false,
    },
  },
  // {
  //   path: '个人中心路径',
  //   name: '个人中心名称',
  //   component: null,
  //   redirect: '/个人中心路径/个人信息',
  //   meta: {
  //     icon: '你看应该是什么图标，还是这个不需要图标',
  //     title: '个人中心',
  //     rank: 1,
  //   },
  //   children: [
  //     // TODO 个人信息中最下面展示 【我的会话】
  //     {
  //       path: '个人信息',
  //       component: null,
  //       meta: {
  //         icon: '你看应该是什么图标，还是这个不需要图标',
  //         title: '个人信息',
  //       },
  //     },
  //     {
  //       path: '登录日志',
  //       component: null,
  //       meta: {
  //         icon: '你看应该是什么图标，还是这个不需要图标',
  //         title: '登录日志',
  //       },
  //     },
  //   ],
  // },
  // 全屏403（无权访问）页面
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('@/views/home/error/403.vue'),
    meta: {
      title: $t('menus.pureAccessDenied'),
      showLink: false,
    },
  },
  // 全屏500（服务器出错）页面
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/views/home/error/500.vue'),
    meta: {
      title: $t('menus.pureServerError'),
      showLink: false,
    },
  },
  {
    path: '/redirect',
    component: Layout,
    meta: {
      title: $t('status.pureLoad'),
      showLink: false,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/layout/redirect.vue'),
      },
    ],
  },
] satisfies Array<RouteConfigsTable>;
