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
  <section class="detail-relation-list-section">
    <div class="detail-relation-list-section__title">
      <span>{{ title }}</span>
      <el-badge v-if="showBadge" :value="itemCount" class="detail-relation-list-section__badge" type="primary" />
    </div>

    <slot name="body">
      <AuthDataTable
        v-if="itemCount > 0"
        :columns="columns"
        :data="items"
        border
        class="detail-relation-list-section__table"
        :max-height="maxHeight"
        :row-key="rowKey"
        size="small"
        stripe
      />
      <el-text v-else class="detail-relation-list-section__empty" type="info">
        {{ emptyText }}
      </el-text>
    </slot>
  </section>
</template>

<style scoped>
.detail-relation-list-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.detail-relation-list-section__badge {
  margin-left: 4px;
}

.detail-relation-list-section__table {
  width: 100%;
}

.detail-relation-list-section__empty {
  display: block;
  padding: 8px 0;
}
</style>
