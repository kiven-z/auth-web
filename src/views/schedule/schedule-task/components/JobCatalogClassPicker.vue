<script lang="ts" setup>
import type { QuartzTaskClassRow } from '@/api/schedule/job';
import { computed } from 'vue';

defineOptions({
  name: 'JobCatalogClassPicker',
});

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: QuartzTaskClassRow[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: undefined,
    placeholder: '',
    disabled: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined];
}>();

interface CatalogSelectOption {
  value: string;
  label: string;
  name: string;
  description?: string;
  className: string;
}

const selectOptions = computed<CatalogSelectOption[]>(() =>
  props.options.map((item) => ({
    value: item.className,
    label: `${item.name || item.className}（${item.description}）`,
    name: item.name || item.className,
    description: item.description,
    className: item.className,
  }))
);

/**
 * 同步 v-model
 * @param value 选中的类全限定名
 */
function handleChange(value: string | undefined) {
  emit('update:modelValue', value);
}
</script>

<template>
  <el-select-v2
    :disabled="disabled"
    :item-height="64"
    :model-value="modelValue"
    :options="selectOptions"
    :placeholder="placeholder"
    clearable
    filterable
    @update:model-value="handleChange"
  >
    <template #default="{ item }">
      <div>
        <div class="font-bold">{{ item.name || item.className }}</div>
        <el-text v-if="item.description" class="text-xs!" type="info">{{ item.description }}</el-text>
      </div>
    </template>
  </el-select-v2>
</template>
