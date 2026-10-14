<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import type { RouteConfigs } from '@/router/types';
import { computed } from 'vue';

import Close from '~icons/ep/close';

interface Props {
  item: RouteConfigs;
  index: number;
  active: boolean;
  fixed: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const canClose = computed(() => !props.fixed && props.index !== 0);
</script>

<template>
  <div :data-tag-index="index" :class="['scroll-item', { 'is-active': active, 'fixed-tag': fixed }]">
    <span class="tag-title">
      {{ transformI18n(item.meta?.title) }}
    </span>
    <span v-if="canClose" class="el-icon-close" @click.stop="$emit('close')">
      <Close />
    </span>
  </div>
</template>
