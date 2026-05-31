<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AssignCheckedApi } from './useAssignChecked';

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
    leftTitle: '',
    leftSubtitle: '',
    sectionLabel: '',
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
            <div v-if="leftSubtitle" class="text-[13px] text-(--el-text-color-secondary)">
              {{ leftSubtitle }}
            </div>
          </div>
        </template>

        <div class="flex justify-between">
          <div v-if="sectionLabel" class="text-xs font-semibold text-(--el-text-color-secondary)">
            {{ sectionLabel }}
          </div>
          <el-button :disabled="saving || !hasSelection" link type="danger" @click="assign.clearAll()">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </div>

        <div v-if="assignedTags.length">
          <el-tag
            v-for="tag in assignedTags"
            :key="tag.key"
            :closable="!saving"
            class="mx-1"
            effect="light"
            type="success"
            @close="assign.removeKey(tag.key)"
          >
            <el-tooltip :content="tag.key" :show-after="400" placement="top">
              <span>{{ tag.label }}</span>
            </el-tooltip>
          </el-tag>
        </div>
        <div v-else class="flex items-center justify-center">
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
