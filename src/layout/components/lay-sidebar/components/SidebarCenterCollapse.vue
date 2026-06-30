<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobal } from '@pureadmin/utils';
import { useNav } from '@/layout/hooks';

import ArrowLeft from '~icons/ri/arrow-left-double-fill';

interface Props {
  isActive?: boolean;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
});

const { t } = useI18n();
const { tooltipEffect } = useNav();

const iconClass = computed(() => {
  return ['w-[16px]', 'h-[16px]'];
});

const { $storage } = useGlobal<GlobalPropertiesApi>();
const themeColor = computed(() => $storage.layout?.themeColor);

const emit = defineEmits<{
  (e: 'toggleClick'): void;
}>();

const toggleClick = () => {
  emit('toggleClick');
};
</script>

<template>
  <div
    v-tippy="{
      content: isActive ? t('buttons.pureClickCollapse') : t('buttons.pureClickExpand'),
      theme: tooltipEffect,
      hideOnClick: 'toggle',
      placement: 'right',
    }"
    class="center-collapse"
    @click="toggleClick"
  >
    <IconifyIconOffline
      :class="[iconClass, themeColor === 'light' ? '' : 'text-primary']"
      :icon="ArrowLeft"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
    />
  </div>
</template>

<style lang="scss" scoped>
.center-collapse {
  position: absolute;
  top: 50%;
  right: 2px;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 34px;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--pure-border-color);
  border-radius: 4px;
  transform: translate(12px, -50%);
}
</style>
