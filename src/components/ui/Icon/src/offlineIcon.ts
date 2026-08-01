// 本地离线图标：仅打包 ri/*、ep/*，在 Layout / 工作台入口 import 后生效
// https://icon-sets.iconify.design/ri/  https://icon-sets.iconify.design/ep/
import { addIcon } from '@iconify/vue/dist/offline';
import { getSvgInfo } from '@pureadmin/utils';

import EpHomeFilled from '~icons/ep/home-filled?raw';
import EpTimer from '~icons/ep/timer?raw';
import RiApps2Line from '~icons/ri/apps-2-line?raw';
import RiBriefcaseLine from '~icons/ri/briefcase-line?raw';
import RiCodeBoxLine from '~icons/ri/code-box-line?raw';
import RiDashboardLine from '~icons/ri/dashboard-line?raw';
import RiDatabase2Line from '~icons/ri/database-2-line?raw';
import RiDeviceLine from '~icons/ri/device-line?raw';
import RiExternalLinkFill from '~icons/ri/external-link-fill?raw';
import RiFile2Line from '~icons/ri/file-2-line?raw';
import RiFileChartLine from '~icons/ri/file-chart-line?raw';
import RiFileCloudLine from '~icons/ri/file-cloud-line?raw';
import RiFileList3Line from '~icons/ri/file-list-3-line?raw';
import RiFileShield2Line from '~icons/ri/file-shield-2-line?raw';
import RiFileUserLine from '~icons/ri/file-user-line?raw';
import RiHistoryLine from '~icons/ri/history-line?raw';
import RiInformationLine from '~icons/ri/information-line?raw';
import RiKey2Line from '~icons/ri/key-2-line?raw';
import RiListCheck3 from '~icons/ri/list-check-3?raw';
import RiLockPasswordLine from '~icons/ri/lock-password-line?raw';
import RiLoginBoxLine from '~icons/ri/login-box-line?raw';
import RiLogoutBoxRLine from '~icons/ri/logout-box-r-line?raw';
import RiMailLine from '~icons/ri/mail-line?raw';
import RiMailSendLine from '~icons/ri/mail-send-line?raw';
import RiMenuLine from '~icons/ri/menu-line?raw';
import RiMessage2Line from '~icons/ri/message-2-line?raw';
import RiNodeTree from '~icons/ri/node-tree?raw';
import RiNotification3Line from '~icons/ri/notification-3-line?raw';
import RiOrganizationChart from '~icons/ri/organization-chart?raw';
import RiRecycleFill from '~icons/ri/recycle-fill?raw';
import RiRecycleLine from '~icons/ri/recycle-line?raw';
import RiRefreshLine from '~icons/ri/refresh-line?raw';
import RiSearchLine from '~icons/ri/search-line?raw';
import RiSendPlaneLine from '~icons/ri/send-plane-line?raw';
import RiSettings3Line from '~icons/ri/settings-3-line?raw';
import RiShieldCrossLine from '~icons/ri/shield-cross-line?raw';
import RiShieldUserLine from '~icons/ri/shield-user-line?raw';
import RiSmartphoneLine from '~icons/ri/smartphone-line?raw';
import RiStackLine from '~icons/ri/stack-line?raw';
import RiTaskLine from '~icons/ri/task-line?raw';
import RiToolsLine from '~icons/ri/tools-line?raw';
import RiUserFollowLine from '~icons/ri/user-follow-line?raw';
import RiUserLine from '~icons/ri/user-line?raw';
import RiUserSettingsLine from '~icons/ri/user-settings-line?raw';
import RiWindowLine from '~icons/ri/window-line?raw';

/**
 * 离线图标表。仅 `ri/*`、`ep/*`；菜单与工作台必须使用本表中的键。
 */
const offlineIconNameSet = new Set<string>();

const icons = [
  // Element Plus
  ['ep/home-filled', EpHomeFilled],
  ['ep/timer', EpTimer],
  // Remix — 布局 / 通用
  ['ri/search-line', RiSearchLine],
  ['ri/information-line', RiInformationLine],
  ['ri/external-link-fill', RiExternalLinkFill],
  // Remix — 系统菜单
  ['ri/settings-3-line', RiSettings3Line],
  ['ri/user-line', RiUserLine],
  ['ri/user-settings-line', RiUserSettingsLine],
  ['ri/user-follow-line', RiUserFollowLine],
  ['ri/shield-user-line', RiShieldUserLine],
  ['ri/key-2-line', RiKey2Line],
  ['ri/organization-chart', RiOrganizationChart],
  ['ri/briefcase-line', RiBriefcaseLine],
  ['ri/menu-line', RiMenuLine],
  ['ri/tools-line', RiToolsLine],
  ['ri/window-line', RiWindowLine],
  ['ri/code-box-line', RiCodeBoxLine],
  ['ri/apps-2-line', RiApps2Line],
  ['ri/file-list-3-line', RiFileList3Line],
  ['ri/lock-password-line', RiLockPasswordLine],
  ['ri/login-box-line', RiLoginBoxLine],
  ['ri/history-line', RiHistoryLine],
  ['ri/file-chart-line', RiFileChartLine],
  ['ri/file-shield-2-line', RiFileShield2Line],
  ['ri/message-2-line', RiMessage2Line],
  ['ri/mail-line', RiMailLine],
  ['ri/mail-send-line', RiMailSendLine],
  ['ri/send-plane-line', RiSendPlaneLine],
  ['ri/smartphone-line', RiSmartphoneLine],
  ['ri/notification-3-line', RiNotification3Line],
  ['ri/task-line', RiTaskLine],
  ['ri/node-tree', RiNodeTree],
  ['ri/stack-line', RiStackLine],
  ['ri/list-check-3', RiListCheck3],
  ['ri/shield-cross-line', RiShieldCrossLine],
  ['ri/file-2-line', RiFile2Line],
  ['ri/file-user-line', RiFileUserLine],
  ['ri/file-cloud-line', RiFileCloudLine],
  ['ri/recycle-line', RiRecycleLine],
  ['ri/recycle-fill', RiRecycleFill],
  // Remix — 用户工作台
  ['ri/dashboard-line', RiDashboardLine],
  ['ri/database-2-line', RiDatabase2Line],
  ['ri/refresh-line', RiRefreshLine],
  ['ri/logout-box-r-line', RiLogoutBoxRLine],
  ['ri/device-line', RiDeviceLine],
];

icons.forEach(([name, icon]) => {
  const iconName = name as string;
  addIcon(iconName, getSvgInfo(icon as unknown as string));
  offlineIconNameSet.add(iconName);
});

/** 已打包的离线图标键名（`集合/图标名`） */
export const offlineIconNames: ReadonlySet<string> = offlineIconNameSet;

/** 允许写入菜单的图标集合前缀 */
export const ALLOWED_ICON_COLLECTIONS = ['ri', 'ep'] as const;
