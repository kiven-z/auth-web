import { $t } from '@/app/plugins/i18n';

/** 个人空间（个人中心 / 我的消息 / 我的文件） */
export default [
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('@/views/home/personal/index.vue'),
    redirect: '/personal/profile',
    meta: {
      showLink: false,
      title: $t('personal.title'),
      icon: 'ri/user-settings-line',
    },
    children: [
      {
        path: 'profile',
        name: 'PersonalProfile',
        component: () => import('@/views/home/account/profile/index.vue'),
        meta: {
          title: $t('personal.nav.profile'),
          showLink: false,
        },
      },
      {
        path: 'security',
        name: 'PersonalSecurity',
        component: () => import('@/views/home/account/security/index.vue'),
        meta: {
          title: $t('personal.nav.security'),
          showLink: false,
        },
      },
      {
        path: 'login-log',
        name: 'PersonalLoginLog',
        component: () => import('@/views/home/account/login-log/index.vue'),
        meta: {
          title: $t('personal.nav.loginLog'),
          showLink: false,
        },
      },
      {
        path: 'inbox',
        name: 'PersonalInbox',
        component: () => import('@/views/home/inbox/index.vue'),
        meta: {
          title: $t('personal.nav.inbox'),
          showLink: false,
        },
      },
      {
        path: 'inbox/detail/:id',
        name: 'PersonalInboxDetail',
        component: () => import('@/views/home/inbox/components/InboxMessageDetailView.vue'),
        meta: {
          title: $t('inAppInbox.detail.title'),
          showLink: false,
        },
      },
      {
        path: 'files',
        name: 'PersonalFiles',
        component: () => import('@/views/home/file/record/index.vue'),
        meta: {
          title: $t('personal.nav.files'),
          showLink: false,
        },
      },
      {
        path: 'export-task',
        name: 'PersonalFileExportTask',
        component: () => import('@/views/home/file/export-task/index.vue'),
        meta: {
          title: $t('personal.nav.exportTask'),
          showLink: false,
        },
      },
      {
        path: 'recycle',
        name: 'PersonalFileRecycle',
        component: () => import('@/views/home/file/recycle/index.vue'),
        meta: {
          title: $t('personal.nav.recycle'),
          showLink: false,
        },
      },
    ],
  },
] satisfies Array<RouteConfigsTable>;
