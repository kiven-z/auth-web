<script lang="ts" setup>
import { useLayout } from '@/layout/hooks';
import type { setType } from '@/layout/types';
import { useAppStore } from '@/store/modules/app/app';
import { useSettingStore } from '@/store/modules/app/settings';
import { useDark, useGlobal } from '@pureadmin/utils';
import { computed, reactive } from 'vue';

import LayNavbar from '@/layout/components/lay-navbar/index.vue';
import NavHorizontal from '@/layout/components/lay-sidebar/NavHorizontal.vue';
import LayTag from '@/layout/components/lay-tag/index.vue';

const { isDark } = useDark();
const { layout } = useLayout();
const pureSetting = useSettingStore();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStore().sidebar;
  }),
  device: computed(() => {
    return useAppStore().device;
  }),
  fixedHeader: computed(() => {
    return pureSetting.fixedHeader;
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
</script>

<template>
  <div
    :class="['fixed-header', { 'fixed-header': set.fixedHeader }]"
    :style="
      set.hideTabs && layout.includes('horizontal')
        ? isDark
          ? 'box-shadow: 0 1px 4px #0d0d0d'
          : 'box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)'
        : ''
    "
  >
    <LayNavbar v-if="!pureSetting.hiddenSideBar && (layout.includes('vertical') || layout.includes('mix'))" />
    <NavHorizontal v-if="!pureSetting.hiddenSideBar && layout.includes('horizontal')" />
    <LayTag />
  </div>
</template>
