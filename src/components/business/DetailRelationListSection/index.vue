<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { computed } from 'vue';

defineOptions({
  name: 'DetailRelationListSection',
});

interface DetailRelationListSectionProps {
  // 区块标题（由调用方完成 i18n）
  title: string;
  // 表格行数据
  items: unknown[];
  // 表格列配置
  columns: TableColumnList;
  // 行主键字段名
  rowKey: string;
  // 无数据时的提示文案（由调用方完成 i18n）
  emptyText: string;
  // 是否在标题旁展示数量角标
  showBadge?: boolean;
  // 表格最大高度
  maxHeight?: number | string;
}

const props = withDefaults(defineProps<DetailRelationListSectionProps>(), {
  showBadge: true,
  maxHeight: 220,
});

const itemCount = computed(() => props.items?.length ?? 0);
</script>

<template>
  <section>
    <div class="mb-2 flex items-center gap-2 text-sm font-semibold">
      <span>{{ title }}</span>
      <el-badge v-if="showBadge" :value="itemCount" class="ml-1" type="primary" />
    </div>

    <slot name="body">
      <AuthDataTable
        v-if="itemCount > 0"
        :columns="columns"
        :data="items"
        :max-height="maxHeight"
        :row-key="rowKey"
        border
        class="w-full"
        stripe
      />
      <el-text v-else class="block py-2" type="info">
        {{ emptyText }}
      </el-text>
    </slot>
  </section>
</template>
