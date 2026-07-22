<script lang="ts" setup>
import 'animate.css';
import '@/components/ui/Icon/src/offlineIcon';
import { getLayoutSnapshot } from '@/core/preferences';
import { useUiLayout } from '@/layout/hooks/layout/useUiLayout';
import { useLayout } from '@/layout/hooks/layout/useLayout';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { useAppStore } from '@/store/modules/app/app';
import { useSettingStore } from '@/store/modules/app/settings';
import { deviceDetection, useGlobal, useResizeObserver } from '@pureadmin/utils';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { setType } from './types';

import BackTopIcon from '@/assets/svg/back_top.svg?component';
import LayContent from './components/lay-content/index.vue';
import LayHeader from './components/lay-header/index.vue';
import LaySetting from './components/lay-setting/index.vue';
import NavVertical from './components/lay-sidebar/NavVertical.vue';

const { t } = useI18n();
const { layout } = useLayout();
const { setResponsiveLayoutTheme } = useUiLayout();
const { dataThemeChange } = useUiTheme();
const appWrapperRef = ref();
const isMobile = deviceDetection();
const authSetting = useSettingStore();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStore().sidebar;
  }),

  device: computed(() => {
    return useAppStore().device;
  }),

  fixedHeader: computed(() => {
    return authSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === 'mobile',
    };
  }),

  hideTabs: computed(() => {
    return $storage?.configure.hideTabs;
  }),
});

function toggle(device: string, bool: boolean) {
  useAppStore().toggleDevice(device);
  useAppStore().toggleSideBar(bool, 'resize');
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

useResizeObserver(appWrapperRef, (entries) => {
  if (isMobile) return;
  const entry = entries[0];
  const [{ inlineSize: width, blockSize: height }] = entry.borderBoxSize;
  useAppStore().setViewportSize({ width, height });
  // 窄屏仅运行时覆盖为 vertical，宽屏恢复用户偏好中的布局（不写回 storage）
  const preferredLayout = getLayoutSnapshot().layout ?? useAppStore().layout;
  width <= 760 ? setResponsiveLayoutTheme('vertical') : setResponsiveLayoutTheme(preferredLayout);
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle('mobile', false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle('desktop', false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990 && !set.sidebar.isClickCollapse) {
    toggle('desktop', true);
    isAutoCloseSidebar = true;
  } else {
    toggle('desktop', false);
    isAutoCloseSidebar = false;
  }
});

onMounted(() => {
  if (isMobile) {
    toggle('mobile', false);
  }
});

onBeforeMount(() => {
  dataThemeChange($storage.layout?.overallStyle);
});
</script>

<template>
  <div ref="appWrapperRef" :class="['app-wrapper', set.classes]">
    <div
      v-show="set.device === 'mobile' && set.sidebar.opened && layout.includes('vertical')"
      class="app-mask"
      @click="useAppStore().toggleSideBar()"
    />
    <NavVertical v-show="!authSetting.hiddenSideBar && (layout.includes('vertical') || layout.includes('mix'))" />
    <div :class="['main-container', authSetting.hiddenSideBar ? 'main-hidden' : '']">
      <div v-if="set.fixedHeader">
        <LayHeader />
        <!-- 主体内容 -->
        <LayContent :fixed-header="set.fixedHeader" />
      </div>
      <el-scrollbar v-else>
        <el-backtop :title="t('buttons.backTop')" target=".main-container .el-scrollbar__wrap">
          <BackTopIcon />
        </el-backtop>
        <LayHeader />
        <!-- 主体内容 -->
        <LayContent :fixed-header="set.fixedHeader" />
      </el-scrollbar>
    </div>
    <!-- 系统设置 -->
    <LaySetting />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    clear: both;
    display: table;
    content: '';
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.app-mask {
  position: absolute;
  top: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}

.re-screen {
  margin-top: 12px;
}
</style>
