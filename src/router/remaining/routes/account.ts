import { $t } from '@/app/plugins/i18n';

/** 个人中心路由 */
export default [
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
] satisfies Array<RouteConfigsTable>;
