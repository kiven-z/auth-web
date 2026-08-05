<script lang="ts" setup>
import { useEpThemeStore } from '@/store/modules/app/epTheme';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CollapseIcon from '../images/collapse.svg?component';
import { TABLE_BAR_DENSITY_OPTIONS, TABLE_BAR_ICON_CLASS, type TableBarDensity } from '../constants';
import { tippyOptions } from '../utils/tippyOptions';

defineOptions({ name: 'DensityDropdown' });

const size = defineModel<TableBarDensity>('size', { required: true });

const { t } = useI18n();
const epThemeStore = useEpThemeStore();

const getItemStyle = computed(() => {
  return (densitySize: TableBarDensity) => ({
    background: densitySize === size.value ? epThemeStore.primaryColor : '',
    color: densitySize === size.value ? '#fff' : 'var(--el-text-color-primary)',
  });
});
</script>

<template>
  <el-dropdown v-tippy="tippyOptions(t, 'tableBar.tippyDensity')" trigger="click">
    <CollapseIcon :class="['w-4', TABLE_BAR_ICON_CLASS]" />
    <template #dropdown>
      <el-dropdown-menu class="translation">
        <el-dropdown-item
          v-for="option in TABLE_BAR_DENSITY_OPTIONS"
          :key="option.value"
          :style="getItemStyle(option.value)"
          @click="size = option.value"
        >
          {{ t(option.labelKey) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
