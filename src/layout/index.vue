<script lang="ts" setup>
import 'animate.css';
import '@/components/ui/Icon/src/offlineIcon';
import { useBreakpointLayout } from '@/layout/composables/useBreakpointLayout';
import { useLayout } from '@/layout/hooks/layout/useLayout';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import LayoutHeader from '@/layout/shell/LayoutHeader.vue';
import LayoutSidebar from '@/layout/shell/LayoutSidebar.vue';
import { getLayoutSnapshot } from '@/core/preferences/storage';
import { useAppStore } from '@/store/modules/app/app';
import { useSettingStore } from '@/store/modules/app/settings';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BackTopIcon from '@/assets/svg/back_top.svg?component';
import LayContent from './components/lay-content/index.vue';
import LaySetting from './components/lay-setting/index.vue';

const { t } = useI18n();
const { layout } = useLayout();
const { dataThemeChange } = useUiTheme();
const appStore = useAppStore();
const settingStore = useSettingStore();

const appWrapperRef = ref<HTMLDivElement>();
useBreakpointLayout(appWrapperRef);

const sidebarOpened = computed(() => appStore.sidebar.opened);
const isMobile = computed(() => appStore.device === 'mobile');
const fixedHeader = computed(() => settingStore.fixedHeader);
const hideSidebar = computed(() => settingStore.hiddenSideBar);

const wrapperClasses = computed(() => ({
  'layout--sidebar-collapsed': !sidebarOpened.value,
  'layout--sidebar-open': sidebarOpened.value,
  'layout--no-animation': appStore.sidebar.withoutAnimation,
  'layout--mobile': isMobile.value,
}));

const showVerticalSidebar = computed(
  () => !hideSidebar.value && (layout.value.includes('vertical') || layout.value.includes('mix'))
);

const showMobileMask = computed(() => isMobile.value && sidebarOpened.value && layout.value.includes('vertical'));

onBeforeMount(() => {
  dataThemeChange(getLayoutSnapshot().overallStyle);
});
</script>

<template>
  <div ref="appWrapperRef" :class="['layout', wrapperClasses]">
    <div v-show="showMobileMask" class="layout__mask" @click="appStore.toggleSideBar()" />
    <LayoutSidebar v-show="showVerticalSidebar" />
    <div :class="['layout__main', hideSidebar ? 'layout__main--hidden' : '']">
      <div v-if="fixedHeader">
        <LayoutHeader />
        <LayContent :fixed-header="fixedHeader" />
      </div>
      <el-scrollbar v-else>
        <el-backtop :title="t('buttons.backTop')" target=".layout__main .el-scrollbar__wrap">
          <BackTopIcon />
        </el-backtop>
        <LayoutHeader />
        <LayContent :fixed-header="fixedHeader" />
      </el-scrollbar>
    </div>
    <LaySetting />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    clear: both;
    display: table;
    content: '';
  }

  &.layout--mobile.layout--sidebar-open {
    position: fixed;
    top: 0;
  }
}

.layout__mask {
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
