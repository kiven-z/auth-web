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
  // 个人中心
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/home/account/index.vue'),
    redirect: '/account/profile',
    meta: {
      showLink: false,
      title: $t('account.title'),
      icon: 'ri/user-settings-line',
      rank: 1,
    },
    children: [
      {
        path: 'profile',
        name: 'AccountProfile',
        component: () => import('@/views/home/account/profile/index.vue'),
        meta: {
          title: $t('account.profile'),
          showLink: false,
        },
      },
      {
        path: 'security',
        name: 'AccountSecurity',
        component: () => import('@/views/home/account/security/index.vue'),
        meta: {
          title: $t('account.security'),
          showLink: false,
        },
      },
      {
        path: 'login-log',
        name: 'AccountLoginLog',
        component: () => import('@/views/home/account/login-log/index.vue'),
        meta: {
          title: $t('account.loginLog'),
          showLink: false,
        },
      },
    ],
  },
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
