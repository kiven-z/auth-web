import { hasAuth } from '@/auth/permission';
import {
  SYS_USER_DEPT_PERMS,
  SYS_USER_PERMS,
  SYS_USER_POST_PERMS,
  SYS_USER_ROLE_PERMS,
} from '@/views/system/user/constants/permissions';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/** 用户工作台侧栏分区键 */
export type UserWorkstationSection =
  | 'overview'
  | 'profile'
  | 'grant-role'
  | 'grant-dept'
  | 'grant-post'
  | 'grant-scope'
  | 'security-password'
  | 'security-auth-refresh'
  | 'security-kick'
  | 'security-sessions';

/** 侧栏分组键 */
export type UserWorkstationNavGroup = 'overview' | 'profile' | 'grant' | 'security';

/** 侧栏菜单项（label 已翻译） */
export interface UserWorkstationNavItem {
  /** 分区键（el-menu index） */
  key: UserWorkstationSection;
  /** 菜单文案 */
  label: string;
  /** Remix Icon 离线键，须在 Icon/src/offline packs 注册（`ri/图标名`） */
  icon: string;
}

/** 侧栏分组（title 已翻译） */
export interface UserWorkstationNavGroupConfig {
  /** 分组键 */
  key: UserWorkstationNavGroup;
  /** 分组标题 */
  title: string;
  /** 分组下菜单项 */
  items: UserWorkstationNavItem[];
}

/** 默认激活分区 */
export const USER_WORKSTATION_DEFAULT_SECTION: UserWorkstationSection = 'overview';

/**
 * 用户工作台侧栏导航（i18n + 权限过滤）
 * @returns 可见分组
 */
function useWorkstationNav() {
  const { t } = useI18n();

  const navGroups = computed<UserWorkstationNavGroupConfig[]>(() => {
    const groups: Array<{
      key: UserWorkstationNavGroup;
      title: string;
      items: Array<UserWorkstationNavItem & { auth?: string }>;
    }> = [
      {
        key: 'overview',
        title: t('users.workstation.nav.group.overview'),
        items: [
          {
            key: 'overview',
            label: t('users.workstation.nav.overview'),
            icon: 'ri/dashboard-line',
            auth: SYS_USER_PERMS.QUERY,
          },
        ],
      },
      {
        key: 'profile',
        title: t('users.workstation.nav.group.profile'),
        items: [
          {
            key: 'profile',
            label: t('users.workstation.nav.profile'),
            icon: 'ri/user-settings-line',
            auth: SYS_USER_PERMS.UPDATE,
          },
        ],
      },
      {
        key: 'grant',
        title: t('users.workstation.nav.group.grant'),
        items: [
          {
            key: 'grant-role',
            label: t('users.workstation.nav.grantRole'),
            icon: 'ri/shield-user-line',
            auth: SYS_USER_ROLE_PERMS.QUERY,
          },
          {
            key: 'grant-dept',
            label: t('users.workstation.nav.grantDept'),
            icon: 'ri/organization-chart',
            auth: SYS_USER_DEPT_PERMS.QUERY,
          },
          {
            key: 'grant-post',
            label: t('users.workstation.nav.grantPost'),
            icon: 'ri/briefcase-line',
            auth: SYS_USER_POST_PERMS.QUERY,
          },
          {
            key: 'grant-scope',
            label: t('users.workstation.nav.grantScope'),
            icon: 'ri/database-2-line',
            auth: SYS_USER_PERMS.QUERY,
          },
        ],
      },
      {
        key: 'security',
        title: t('users.workstation.nav.group.security'),
        items: [
          {
            key: 'security-password',
            label: t('users.workstation.nav.password'),
            icon: 'ri/lock-password-line',
            auth: SYS_USER_PERMS.UPDATE,
          },
          {
            key: 'security-auth-refresh',
            label: t('users.workstation.nav.authRefresh'),
            icon: 'ri/refresh-line',
            auth: SYS_USER_PERMS.AUTH_REFRESH,
          },
          {
            key: 'security-kick',
            label: t('users.workstation.nav.kick'),
            icon: 'ri/logout-box-r-line',
            auth: SYS_USER_PERMS.KICK_ALL,
          },
          {
            key: 'security-sessions',
            label: t('users.workstation.nav.sessions'),
            icon: 'ri/device-line',
            auth: SYS_USER_PERMS.VIEW_SESSIONS,
          },
        ],
      },
    ];

    return groups
      .map((group) => ({
        key: group.key,
        title: group.title,
        items: group.items
          .filter((item) => !item.auth || hasAuth(item.auth))
          .map(({ key, label, icon }) => ({ key, label, icon })),
      }))
      .filter((group) => group.items.length > 0);
  });

  return { navGroups };
}

export default useWorkstationNav;
