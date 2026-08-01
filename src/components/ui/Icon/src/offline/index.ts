/**
 * 本地离线图标入口：按场景 pack 注册，仅打包 `ri/*`、`ep/*`。
 * Layout 用 `shell`；独立全页（如工作台）用本入口（shell + workstation）。
 * https://icon-sets.iconify.design/ri/  https://icon-sets.iconify.design/ep/
 */
import './shell';
import './packs/workstation';

export { ALLOWED_ICON_COLLECTIONS } from './constants';
export { offlineIconNames } from './nameSet';
