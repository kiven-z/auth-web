import { $t } from '@/app/plugins/i18n';
import { SYS_USER_PERMS } from '@/views/system/user/constants/permissions';

/** 用户管理工作台（独立全页，不进侧栏菜单，由用户列表进入） */
export default [
  {
    path: '/system/user-workstation/:userId',
    name: 'UserWorkstation',
    component: () => import('@/views/system/user/workstation/index.vue'),
    meta: {
      title: $t('users.workstation.title'),
      showLink: false,
      /** 进入门槛：与用户列表查询权限一致 */
      auths: SYS_USER_PERMS.QUERY,
    },
  },
] satisfies Array<RouteConfigsTable>;
