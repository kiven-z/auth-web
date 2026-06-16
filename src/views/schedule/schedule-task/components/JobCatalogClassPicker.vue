<script lang="ts" setup>
import type { QuartzTaskClassRow } from '@/api/schedule/job';
import { computed } from 'vue';

defineOptions({
  name: 'JobCatalogClassPicker',
});

const props = withDefaults(
  defineProps<{
    options: QuartzTaskClassRow[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: '',
    disabled: false,
  }
);

const modelValue = defineModel<string>();

interface CatalogSelectOption {
  value: string;
  label: string;
  name: string;
  description?: string;
  className: string;
}

/**
 * 任务目录类展示文案：名称（说明）
 * @param item 白名单任务类
 * @returns 下拉选中态展示文本
 */
function formatJobCatalogClassLabel(item: Pick<QuartzTaskClassRow, 'name' | 'className' | 'description'>): string {
  const title = item.name || item.className;
  if (!item.description) {
    return title;
  }
  return `${title}（${item.description}）`;
}

// 计算属性：下拉选项
const selectOptions = computed<CatalogSelectOption[]>(() =>
  props.options.map((item) => ({
    value: item.className,
    label: formatJobCatalogClassLabel(item),
    name: item.name || item.className,
    description: item.description,
    className: item.className,
  }))
);
</script>

<template>
  <el-select-v2
    v-model="modelValue"
    :disabled="disabled"
    :item-height="46"
    :options="selectOptions"
    :placeholder="placeholder"
    class="w-full job-catalog-class-picker"
    clearable
    filterable
    popper-class="job-catalog-class-picker-popper"
  >
    <template #default="{ item }">
      <div class="job-catalog-class-picker__option">
        <div class="job-catalog-class-picker__title">{{ item.name || item.className }}</div>
        <div v-if="item.description" class="job-catalog-class-picker__desc">{{ item.description }}</div>
      </div>
    </template>
  </el-select-v2>
</template>

<style scoped>
.job-catalog-class-picker__option {
  padding: 6px 0;
  line-height: 1.4;
}

.job-catalog-class-picker__title {
  font-weight: 800;
}

.job-catalog-class-picker__desc {
  font-size: 12px;
  line-height: 1.35;
  color: var(--el-text-color-secondary);
}
</style>
