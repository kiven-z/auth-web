<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'AssignPanel' });

const selectedKeys = defineModel<string[]>({ required: true });

const props = withDefaults(
  defineProps<{
    labels: Record<string, string>;
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

const assignedItems = computed(() => selectedKeys.value.map((key) => ({ key, label: props.labels[key] ?? key })));
const hasSelection = computed(() => selectedKeys.value.length > 0);

/**
 * 移除已选 key
 * @param key 行 key
 */
function removeKey(key: string) {
  selectedKeys.value = selectedKeys.value.filter((item) => item !== key);
}

/**
 * 清空已选
 */
function clearAll() {
  selectedKeys.value = [];
}
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
            <el-badge :max="999" :offset="[0, -2]" :value="assignedItems.length" type="primary">
              {{ sectionLabel }}
            </el-badge>
          </el-text>

          <el-button :disabled="saving || !hasSelection" link type="danger" @click="clearAll()">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </div>

        <el-scrollbar v-if="hasSelection" max-height="60vh">
          <div class="grid grid-cols-2 gap-1.5">
            <el-tooltip
              v-for="item in assignedItems"
              :key="item.key"
              :content="item.label"
              :show-after="400"
              placement="top"
            >
              <div class="min-w-0">
                <el-tag
                  :closable="!saving"
                  class="assign-panel__tag w-full"
                  effect="light"
                  type="success"
                  @close="removeKey(item.key)"
                >
                  <span class="assign-panel__tag-text">{{ item.label }}</span>
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
