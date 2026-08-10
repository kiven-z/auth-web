<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AssignCheckedApi } from '@/features/system/_shared/hooks/useAssignChecked';

defineOptions({ name: 'AssignPanel' });

const props = withDefaults(
  defineProps<{
    assign: AssignCheckedApi;
    leftTitle?: string;
    leftSubtitle?: string;
    sectionLabel?: string;
    leftSpan?: number;
    saving?: boolean;
  }>(),
  {
    leftSpan: 8,
    saving: false,
  }
);

const { t } = useI18n();

const assignedTags = computed(() => props.assign.assignedTags.value);
const hasSelection = computed(() => props.assign.hasSelection.value);
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="leftSpan">
      <el-card shadow="never">
        <template #header>
          <div>
            <div v-if="leftTitle" class="font-semibold">
              {{ leftTitle }}
            </div>
            <el-text v-if="leftSubtitle" type="info">
              {{ leftSubtitle }}
            </el-text>
          </div>
        </template>

        <div class="mb-2 flex items-center justify-between gap-2">
          <el-text v-if="sectionLabel" class="text-xs font-semibold" type="info">
            <el-badge :max="999" :offset="[0, -2]" :value="assignedTags.length" type="primary">
              {{ sectionLabel }}
            </el-badge>
          </el-text>

          <el-button :disabled="saving || !hasSelection" link type="danger" @click="assign.clearAll()">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </div>

        <el-scrollbar v-if="assignedTags.length" max-height="60vh">
          <div class="grid grid-cols-4 gap-1.5">
            <el-tooltip
              v-for="tag in assignedTags"
              :key="tag.key"
              :content="tag.label"
              :show-after="400"
              placement="top"
            >
              <div class="min-w-0">
                <el-tag
                  :closable="!saving"
                  class="assign-panel__tag w-full"
                  effect="light"
                  type="success"
                  @close="assign.removeKey(tag.key)"
                >
                  <span class="assign-panel__tag-text">{{ tag.label }}</span>
                </el-tag>
              </div>
            </el-tooltip>
          </div>
        </el-scrollbar>
        <div v-else class="flex items-center justify-center py-8">
          <el-text type="info">
            {{ t('tips.assignEmptySelected') }}
          </el-text>
        </div>
      </el-card>
    </el-col>

    <el-col :span="24 - leftSpan">
      <slot />
    </el-col>
  </el-row>
</template>

<style scoped>
.assign-panel__tag {
  min-width: 0;
  max-width: 100%;
}

.assign-panel__tag :deep(.el-tag__content) {
  min-width: 0;
  overflow: hidden;
}

.assign-panel__tag-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
