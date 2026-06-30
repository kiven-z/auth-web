import { getLayoutSnapshot } from '@/core/preferences';
import { getConfig } from '@/auth/config';
import { store } from '@/store';
import { deviceDetection } from '@pureadmin/utils';
import { defineStore } from 'pinia';
import { setSidebarOpened } from '@/core/preferences/actions';
import type { appType } from '../types';

export const useAppStore = defineStore('pure-app', {
  state: (): appType => ({
    sidebar: {
      opened: getLayoutSnapshot().sidebarStatus ?? getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickCollapse: false,
    },
    layout: getLayoutSnapshot().layout ?? getConfig().Layout,
    device: deviceDetection() ? 'mobile' : 'desktop',
    viewportSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
  }),
  getters: {
    getSidebarStatus(state) {
      return state.sidebar.opened;
    },
    getDevice(state) {
      return state.device;
    },
    getViewportWidth(state) {
      return state.viewportSize.width;
    },
    getViewportHeight(state) {
      return state.viewportSize.height;
    },
  },
  actions: {
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      setSidebarOpened(opened, { resize });
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    setViewportSize(size) {
      this.viewportSize = size;
    },
  },
});

export function useAppStoreHook() {
  return useAppStore(store);
}
