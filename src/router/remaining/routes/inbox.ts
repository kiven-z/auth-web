import { $t } from '@/app/plugins/i18n';

/** 我的消息路由 */
export default [
  {
    path: '/inbox',
    name: 'HomeInbox',
    component: () => import('@/views/home/inbox/index.vue'),
    meta: {
      showLink: false,
      title: $t('routes.myInbox'),
    },
  },
  {
    path: '/inbox/detail/:id',
    name: 'HomeInboxDetail',
    component: () => import('@/views/home/inbox/components/InboxMessageDetailView.vue'),
    meta: {
      showLink: false,
      title: $t('inAppInbox.detail.title'),
    },
  },
] satisfies Array<RouteConfigsTable>;
