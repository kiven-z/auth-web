<script lang="ts" setup>
import { ElTag, ElTooltip } from 'element-plus';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AssignGetRowLabel, AssignSeedItem } from './types';
import { useAssignChecked } from './useAssignChecked';

defineOptions({ name: 'AssignManagePanel' });

const props = withDefaults(
  defineProps<{
    leftTitle?: string;
    leftSubtitle?: string;
    assignedSectionLabel?: string;
    rowKey: string;
    saving?: boolean;
    seed?: AssignSeedItem[];
    leftSpan?: number;
    getRowLabel: AssignGetRowLabel;
  }>(),
  {
    leftTitle: '',
    leftSubtitle: '',
    assignedSectionLabel: '',
    seed: () => [],
    leftSpan: 7,
  }
);

const { t } = useI18n();

const assignApi = useAssignChecked({
  rowKey: props.rowKey,
  getRowLabel: props.getRowLabel,
});

const {
  assignedTags,
  canClearRemovable,
  applySeed,
  mergeLabels,
  isLocked,
  removeKey,
  clearRemovable,
  getSelectedKeys,
} = assignApi;

watch(
  () => props.seed,
  (seed) => {
    applySeed(seed);
  },
  { immediate: true, deep: true }
);

defineExpose({
  getSelectedKeys,
  mergeLabels,
});
</script>

<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="leftSpan">
        <el-card shadow="never">
          <template #header>
            <div>
              <div v-if="leftTitle" class="font-semibold">
                {{ leftTitle }}
              </div>
              <div v-if="leftSubtitle" class="text-[13px] text-(--el-text-color-secondary)">
                {{ leftSubtitle }}
              </div>
            </div>
          </template>

          <div class="flex justify-between">
            <div v-if="assignedSectionLabel" class="text-xs font-semibold text-(--el-text-color-secondary)">
              {{ assignedSectionLabel }}
            </div>
            <el-button :disabled="saving || !canClearRemovable" link type="danger" @click="clearRemovable">
              {{ t('buttons.assignClearAll') }}
            </el-button>
          </div>

          <div v-if="assignedTags.length" class="assign-manage-panel__tags">
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="!isLocked(tag.key) && !saving"
              effect="light"
              type="success"
              @close="removeKey(tag.key)"
            >
              <el-tooltip :content="tag.key" :show-after="400" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
          </div>
          <div v-else class="assign-manage-panel__tags flex items-center justify-center">
            <el-text type="info">
              {{ t('tips.assignEmptySelected') }}
            </el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24 - leftSpan">
        <slot :assign="assignApi" name="right" />
      </el-col>
    </el-row>
  </div>
</template>
