import reDrawer from './index.vue';
import type { ArgsType, ButtonProps, DrawerOptions, DrawerProps, EventType } from './type';
import { withInstall } from '@/shared/vue/withInstall';
import { useTimeoutFn } from '@vueuse/core';
import isFunction from 'lodash/isFunction';
import { ref } from 'vue';

const drawerStore = ref<Array<DrawerOptions>>([]);

/** 打开抽屉 */
const addDrawer = (options: DrawerOptions) => {
  const open = () => drawerStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 关闭抽屉 */
const closeDrawer = (options: DrawerOptions, index: number, args?: any) => {
  drawerStore.value[index].visible = false;
  options.closeCallBack && options.closeCallBack({ options, index, args });

  const closeDelay = options?.closeDelay ?? 200;
  useTimeoutFn(() => {
    drawerStore.value.splice(index, 1);
  }, closeDelay);
};

/**
 * 触发确定：loading → beforeSure → done/closeLoading
 * 底部确定按钮与表单回车共用此入口
 */
const confirmDrawer = (options: DrawerOptions, index: number) => {
  const loadingEnabled = options.confirmLoadingEnabled ?? Boolean(options.beforeSure);
  if (loadingEnabled) {
    options.confirmLoading = true;
  }
  const closeLoading = () => {
    if (loadingEnabled) {
      options.confirmLoading = false;
    }
  };
  const done = () => {
    closeLoading();
    closeDrawer(options, index, { command: 'sure' });
  };
  if (options?.beforeSure && isFunction(options.beforeSure)) {
    void options.beforeSure(done, { options, index, closeLoading });
    return;
  }
  done();
};

/**
 * @description 更改抽屉自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDrawer = (value: any, key = 'title', index = 0) => {
  drawerStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDrawer = () => {
  drawerStore.value = [];
};

const AuthDrawer = withInstall(reDrawer);

export type { EventType, ArgsType, DrawerOptions, DrawerProps, ButtonProps };
export { AuthDrawer, drawerStore, addDrawer, closeDrawer, confirmDrawer, updateDrawer, closeAllDrawer };
