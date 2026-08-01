import {
  SYS_USER_DEPT_PERMS,
  SYS_USER_PERMS,
  SYS_USER_POST_PERMS,
  SYS_USER_ROLE_PERMS,
} from '@/views/system/user/constants/permissions';

/**
 * 用户工作台侧栏分区键
 */
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

/**
 * 侧栏分组
 */
export type UserWorkstationNavGroup = 'overview' | 'profile' | 'grant' | 'security';

/**
 * 侧栏菜单项
 */
export interface UserWorkstationNavItem {
  /** 分区键（el-menu index） */
  key: UserWorkstationSection;
  /** i18n label key */
  labelKey: string;
  /** Remix Icon 离线键，须在 offlineIcon.ts 注册（`ri/图标名`） */
  icon: string;
  /**
   * 可见所需权限码；未配置则进入工作台即可看见。
   * 与按钮权限一致，由 hasAuth 判断。
   */
  auth?: string;
}

/**
 * 侧栏分组配置
 */
export interface UserWorkstationNavGroupConfig {
  /** 分组键 */
  key: UserWorkstationNavGroup;
  /** i18n 分组标题 key */
  titleKey: string;
  /** 分组下菜单项 */
  items: UserWorkstationNavItem[];
}

/**
 * 工作台侧栏导航（静态配置；渲染前按 auth 过滤）
 */
export const USER_WORKSTATION_NAV_GROUPS: UserWorkstationNavGroupConfig[] = [
  {
    key: 'overview',
    titleKey: 'users.workstation.nav.group.overview',
    items: [
      {
        key: 'overview',
        labelKey: 'users.workstation.nav.overview',
        icon: 'ri/dashboard-line',
        auth: SYS_USER_PERMS.QUERY,
      },
    ],
  },
  {
    key: 'profile',
    titleKey: 'users.workstation.nav.group.profile',
    items: [
      {
        key: 'profile',
        labelKey: 'users.workstation.nav.profile',
        icon: 'ri/user-settings-line',
        auth: SYS_USER_PERMS.UPDATE,
      },
    ],
  },
  {
    key: 'grant',
    titleKey: 'users.workstation.nav.group.grant',
    items: [
      {
        key: 'grant-role',
        labelKey: 'users.workstation.nav.grantRole',
        icon: 'ri/shield-user-line',
        auth: SYS_USER_ROLE_PERMS.QUERY,
      },
      {
        key: 'grant-dept',
        labelKey: 'users.workstation.nav.grantDept',
        icon: 'ri/organization-chart',
        auth: SYS_USER_DEPT_PERMS.QUERY,
      },
      {
        key: 'grant-post',
        labelKey: 'users.workstation.nav.grantPost',
        icon: 'ri/briefcase-line',
        auth: SYS_USER_POST_PERMS.QUERY,
      },
      {
        key: 'grant-scope',
        labelKey: 'users.workstation.nav.grantScope',
        icon: 'ri/database-2-line',
        auth: SYS_USER_PERMS.QUERY,
      },
    ],
  },
  {
    key: 'security',
    titleKey: 'users.workstation.nav.group.security',
    items: [
      {
        key: 'security-password',
        labelKey: 'users.workstation.nav.password',
        icon: 'ri/lock-password-line',
        auth: SYS_USER_PERMS.UPDATE,
      },
      {
        key: 'security-auth-refresh',
        labelKey: 'users.workstation.nav.authRefresh',
        icon: 'ri/refresh-line',
        auth: SYS_USER_PERMS.AUTH_REFRESH,
      },
      {
        key: 'security-kick',
        labelKey: 'users.workstation.nav.kick',
        icon: 'ri/logout-box-r-line',
        auth: SYS_USER_PERMS.KICK_ALL,
      },
      {
        key: 'security-sessions',
        labelKey: 'users.workstation.nav.sessions',
        icon: 'ri/device-line',
        auth: SYS_USER_PERMS.VIEW_SESSIONS,
      },
    ],
  },
];

/** 默认激活分区 */
export const USER_WORKSTATION_DEFAULT_SECTION: UserWorkstationSection = 'overview';
