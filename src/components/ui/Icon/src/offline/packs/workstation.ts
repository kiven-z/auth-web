// Remix — 用户工作台专用（独立全页入口按需加载）
import RiDashboardLine from '~icons/ri/dashboard-line?raw';
import RiDatabase2Line from '~icons/ri/database-2-line?raw';
import RiDeviceLine from '~icons/ri/device-line?raw';
import RiLogoutBoxRLine from '~icons/ri/logout-box-r-line?raw';
import RiRefreshLine from '~icons/ri/refresh-line?raw';
import { registerOfflineIcons } from '../register';

registerOfflineIcons([
  ['ri/dashboard-line', RiDashboardLine],
  ['ri/database-2-line', RiDatabase2Line],
  ['ri/refresh-line', RiRefreshLine],
  ['ri/logout-box-r-line', RiLogoutBoxRLine],
  ['ri/device-line', RiDeviceLine],
]);
