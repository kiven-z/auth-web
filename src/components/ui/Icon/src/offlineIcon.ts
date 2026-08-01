// 本地离线图标：在 Layout / 工作台等入口 import 本文件后生效，避免依赖 Iconify CDN
// https://icon-sets.iconify.design/ep/
// https://icon-sets.iconify.design/ri/
import { addIcon } from '@iconify/vue/dist/offline';
import { getSvgInfo } from '@pureadmin/utils';
import EpHomeFilled from '~icons/ep/home-filled?raw';
import RiBriefcaseLine from '~icons/ri/briefcase-line?raw';
import RiDashboardLine from '~icons/ri/dashboard-line?raw';
import RiDatabase2Line from '~icons/ri/database-2-line?raw';
import RiDeviceLine from '~icons/ri/device-line?raw';
import RiInformationLine from '~icons/ri/information-line?raw';
import RiLockPasswordLine from '~icons/ri/lock-password-line?raw';
import RiLogoutBoxRLine from '~icons/ri/logout-box-r-line?raw';
import RiOrganizationChart from '~icons/ri/organization-chart?raw';
import RiRefreshLine from '~icons/ri/refresh-line?raw';
import RiSearchLine from '~icons/ri/search-line?raw';
import RiShieldUserLine from '~icons/ri/shield-user-line?raw';
import RiUserSettingsLine from '~icons/ri/user-settings-line?raw';

/**
 * 离线图标表。键统一为 `集合/图标名`（斜杠）；`useRenderIcon` 会把 `集合:图标名` 规范成同一形式。
 * 后端菜单 icon、工作台 nav 均应使用本表中的键。
 */
const icons = [
  // Element Plus
  ['ep/home-filled', EpHomeFilled],
  // Remix — 通用
  ['ri/search-line', RiSearchLine],
  ['ri/information-line', RiInformationLine],
  ['ri/user-settings-line', RiUserSettingsLine],
  // Remix — 用户工作台
  ['ri/dashboard-line', RiDashboardLine],
  ['ri/shield-user-line', RiShieldUserLine],
  ['ri/organization-chart', RiOrganizationChart],
  ['ri/briefcase-line', RiBriefcaseLine],
  ['ri/database-2-line', RiDatabase2Line],
  ['ri/lock-password-line', RiLockPasswordLine],
  ['ri/refresh-line', RiRefreshLine],
  ['ri/logout-box-r-line', RiLogoutBoxRLine],
  ['ri/device-line', RiDeviceLine],
];

icons.forEach(([name, icon]) => {
  addIcon(name as string, getSvgInfo(icon as string));
});
