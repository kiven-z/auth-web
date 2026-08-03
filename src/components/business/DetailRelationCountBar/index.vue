<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DetailRelationCountBar',
});

/** 详情页关联计数项 */
export interface DetailRelationCountItem {
  /** 展示文案（调用方已 i18n） */
  label: string;
  /** 关联数量 */
  count: number | null | undefined;
}

/** 详情页关联计数条 props */
interface DetailRelationCountBarProps {
  /** 计数项 */
  items: DetailRelationCountItem[];
  /** 是否展示「查看授权」入口 */
  showViewAuthorization?: boolean;
}

const props = withDefaults(defineProps<DetailRelationCountBarProps>(), {
  showViewAuthorization: true,
});

const emit = defineEmits<{
  viewAuthorization: [];
}>();

const { t } = useI18n();

const normalizedItems = computed(() =>
  props.items.map((item) => ({
    label: item.label,
    count: Number(item.count ?? 0),
  }))
);

/**
 * 触发查看授权
 */
function handleViewAuthorization() {
  emit('viewAuthorization');
}
</script>

<template>
  <section class="detail-relation-count-bar">
    <div class="detail-relation-count-bar__header">
      <span class="detail-relation-count-bar__title">{{ t('authorization.relationTitle') }}</span>
      <el-button v-if="showViewAuthorization" link type="primary" @click="handleViewAuthorization">
        {{ t('authorization.view') }}
      </el-button>
    </div>

    <div class="detail-relation-count-bar__items" role="list">
      <div v-for="item in normalizedItems" :key="item.label" class="detail-relation-count-bar__item" role="listitem">
        <span class="detail-relation-count-bar__label">{{ item.label }}</span>
        <span class="detail-relation-count-bar__value">{{ item.count }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail-relation-count-bar__header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-relation-count-bar__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-relation-count-bar__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.detail-relation-count-bar__item {
  display: inline-flex;
  gap: 8px;
  align-items: baseline;
  cursor: default;
  user-select: none;
}

.detail-relation-count-bar__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.detail-relation-count-bar__value {
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--el-text-color-primary);
}
</style>
