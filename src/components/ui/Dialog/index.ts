import { ref } from 'vue';
import reDialog from './src/Dialog.vue';
import { useTimeoutFn } from '@vueuse/core';
import { withInstall } from '@/shared/vue/withInstall';
import isFunction from 'lodash/isFunction';
import type { ArgsType, ButtonProps, DialogOptions, DialogProps, EventType } from './src/type';

const dialogStore = ref<Array<DialogOptions>>([]);

/** 打开弹框 */
const addDialog = (options: DialogOptions) => {
  const open = () => dialogStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 关闭弹框 */
const closeDialog = (options: DialogOptions, index: number, args?: any) => {
  dialogStore.value[index].visible = false;
  options.closeCallBack && options.closeCallBack({ options, index, args });

  const closeDelay = options?.closeDelay ?? 200;
  useTimeoutFn(() => {
    dialogStore.value.splice(index, 1);
  }, closeDelay);
};

/**
 * 触发确定：loading → beforeSure → done/closeLoading
 * 底部确定按钮与表单回车共用此入口
 */
const confirmDialog = (options: DialogOptions, index: number) => {
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
    closeDialog(options, index, { command: 'sure' });
  };
  if (options?.beforeSure && isFunction(options.beforeSure)) {
    Promise.resolve(options.beforeSure(done, { options, index, closeLoading })).catch(() => undefined);
    return;
  }
  done();
};

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDialog = (value: any, key = 'title', index = 0) => {
  dialogStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDialog = () => {
  dialogStore.value = [];
};

const AuthDialog = withInstall(reDialog);

export type { EventType, ArgsType, DialogProps, ButtonProps, DialogOptions };
export { AuthDialog, dialogStore, addDialog, closeDialog, confirmDialog, updateDialog, closeAllDialog };
