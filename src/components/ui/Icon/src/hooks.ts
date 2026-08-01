import { type Component, defineComponent, h } from 'vue';
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from '../index';
import { offlineIconNames } from './offline/nameSet';
import type { iconType } from './types';

/**
 * 支持 `iconfont`、自定义 `svg` 以及 `iconify` 离线/在线图标
 * @param icon 图标
 * @param attrs iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  // iconfont
  const ifReg = /^IF-/;
  // typeof icon === "function" 属于SVG
  if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(0, name.indexOf(' ') == -1 ? name.length : name.indexOf(' '));
    const iconType = name.slice(name.indexOf(' ') + 1, name.length);
    return defineComponent({
      name: 'FontIcon',
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs,
        });
      },
    });
  } else if (typeof icon === 'function' || typeof icon?.render === 'function') {
    // svg
    return attrs ? h(icon, { ...attrs }) : icon;
  } else if (typeof icon === 'object') {
    return defineComponent({
      name: 'OfflineIcon',
      render() {
        return h(IconifyIconOffline, {
          icon: icon,
          ...attrs,
        });
      },
    });
  } else {
    // 已打包离线键走 Offline；否则转在线键名走 CDN
    return defineComponent({
      name: 'Icon',
      render() {
        if (!icon) return;
        const offlineName = String(icon).replace(':', '/');
        if (offlineIconNames.has(offlineName)) {
          return h(IconifyIconOffline, {
            icon: offlineName,
            ...attrs,
          });
        }
        return h(IconifyIconOnline, {
          icon: offlineName.replace('/', ':'),
          ...attrs,
        });
      },
    });
  }
}
