import fontIcon from './src/iconfont';
import iconifyIconOffline from './src/iconifyIconOffline';
import iconifyIconOnline from './src/iconifyIconOnline';
import IconSelect from './src/Select.vue';
/** 壳层离线图标注册（ep / ri / system-menu）；main 引入本包时生效 */
import './src/offline/shell';

export { useRenderIcon } from './src/hooks';
export type { iconType } from './src/types';
export { IconJson } from './data';

/** 本地图标组件 */
const IconifyIconOffline = iconifyIconOffline;
/** 在线图标组件 */
const IconifyIconOnline = iconifyIconOnline;
/** `iconfont`组件 */
const FontIcon = fontIcon;

export { IconifyIconOffline, IconifyIconOnline, FontIcon, IconSelect };
export default IconSelect;
