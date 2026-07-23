<script lang="ts" setup>
import { useLayout } from '@/layout/hooks/layout/useLayout';
import HorizontalNav from '@/layout/shell/HorizontalNav.vue';
import VerticalNavbar from '@/layout/shell/VerticalNavbar.vue';
import { getUiPreferenceState } from '@/core/preferences/storage';
import { useSettingStore } from '@/store/modules/app/settings';
import { useDark } from '@pureadmin/utils';
import { computed } from 'vue';
import LayTag from '../components/lay-tag/index.vue';

const { isDark } = useDark();
const { layout } = useLayout();
const settingStore = useSettingStore();
const preferenceState = getUiPreferenceState();

const fixedHeader = computed(() => settingStore.fixedHeader);
const hideTabs = computed(() => preferenceState.configure.hideTabs);
const showVerticalNav = computed(
  () => !settingStore.hiddenSideBar && (layout.value.includes('vertical') || layout.value.includes('mix'))
);
const showHorizontalNav = computed(() => !settingStore.hiddenSideBar && layout.value.includes('horizontal'));

const headerShadowStyle = computed(() => {
  if (!(hideTabs.value && layout.value.includes('horizontal'))) {
    return '';
  }
  return isDark.value ? 'box-shadow: 0 1px 4px #0d0d0d' : 'box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)';
});

const headerClass = computed(() => ['layout-header', { 'layout-header--fixed': fixedHeader.value }]);
</script>

<template>
  <div :class="headerClass" :style="headerShadowStyle">
    <VerticalNavbar v-if="showVerticalNav" />
    <HorizontalNav v-if="showHorizontalNav" />
    <LayTag />
  </div>
</template>
