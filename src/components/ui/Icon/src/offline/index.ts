/**
 * 本地离线图标入口：按集合 pack 注册，仅打包 `ri/*`、`ep/*`。
 * Layout 与独立全页均可 import 本入口或 `shell`（二者等价）。
 * https://icon-sets.iconify.design/ri/  https://icon-sets.iconify.design/ep/
 */
import './shell';

export { ALLOWED_ICON_COLLECTIONS } from './constants';
export { offlineIconNames } from './nameSet';
