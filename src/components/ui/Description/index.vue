<template>
  <div>
    <div v-if="columns.length">
      <!-- 数组 -> 多个描述 (一行一个表格) -->
      <template v-if="isArrayData">
        <el-descriptions
          v-for="(row, rowIndex) in rows"
          :key="getRowKey(row, rowIndex)"
          :border="border"
          :column="column"
          :title="rowIndex === 0 ? title : undefined"
          v-bind="$attrs"
        >
          <!-- 描述项 -->
          <el-descriptions-item
            v-for="item in columns"
            :key="`${getRowKey(row, rowIndex)}-${item.prop}`"
            v-bind="getItemProps(item)"
          >
            <template v-if="item.labelRenderer" #label>
              <component :is="item.labelRenderer({ data: currentData })" />
            </template>

            <!-- 描述项内容 -->
            <template v-if="item.cellRenderer">
              <component
                :is="
                  item.cellRenderer({
                    value: getValue(row, item),
                    data: currentData,
                    index: rowIndex,
                    row,
                  })
                "
              />
            </template>

            <!-- 描述项内容 -->
            <template v-else>
              <span class="re-description__cell">
                <span class="re-description__value">{{ formatValue(getValue(row, item)) }}</span>
                <el-icon
                  v-if="item.copy && canCopy(getValue(row, item))"
                  :size="16"
                  class="re-description__copy-icon"
                  color="var(--el-color-primary)"
                  @click="handleCopy(getValue(row, item))"
                >
                  <CopyDocument />
                </el-icon>
              </span>
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 单个对象 -> 单个描述 -->
      <el-descriptions v-else :border="border" :column="column" :title="title" v-bind="$attrs">
        <el-descriptions-item v-for="item in columns" :key="item.prop" v-bind="getItemProps(item)">
          <!-- 描述项 -->
          <template v-if="item.labelRenderer" #label>
            <!-- 描述项标签 -->
            <component :is="item.labelRenderer({ data: currentData })" />
          </template>

          <!-- 描述项内容 -->
          <template v-if="item.cellRenderer">
            <!-- 描述项内容 -->
            <component
              :is="
                item.cellRenderer({
                  value: getValue(rows[0], item),
                  data: currentData,
                  index: 0,
                  row: rows[0],
                })
              "
            />
          </template>

          <template v-else>
            <!-- 描述项内容 -->
            <span class="re-description__cell">
              <span class="re-description__value">{{ formatValue(getValue(rows[0], item)) }}</span>
              <!-- 复制按钮 -->
              <el-icon
                v-if="item.copy && canCopy(getValue(rows[0], item))"
                :size="16"
                class="re-description__copy-icon"
                color="var(--el-color-primary)"
                @click="handleCopy(getValue(rows[0], item))"
              >
                <CopyDocument />
              </el-icon>
            </span>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-empty v-else />
  </div>
</template>

<script lang="ts" setup>
import { message } from '@/shared/messaging/message';
import { CopyDocument } from '@element-plus/icons-vue';
import type { DescriptionItemProps } from 'element-plus';
import get from 'lodash/get';
import { computed } from 'vue';

defineOptions({
  name: 'UiDescription',
});

type Row = Record<string, any>;
type RowKey = string | number;

/**
 * 描述项属性
 */
interface ColumnProps extends Partial<DescriptionItemProps> {
  label: string;
  // 支持 lodash path：a.b.c
  prop: string;
  copy?: boolean;
  cellRenderer?: (params: { value: any; data: Row | Row[]; index: number; row: Row }) => any;
  labelRenderer?: (params: { data: Row | Row[] }) => any;
  [key: string]: any;
}

type RowKeyProp = string | ((row: Row, index: number) => RowKey);

/**
 * 属性
 */
const props = withDefaults(
  defineProps<{
    columns: ColumnProps[];
    data: Row | Row[];
    title?: string;
    column?: number;
    border?: boolean;
    placeholder?: string;
    rowKey?: RowKeyProp;
  }>(),
  {
    column: 3,
    border: true,
    placeholder: '-',
    rowKey: 'id',
  }
);

/**
 * 当前数据
 */
const currentData = computed(() => props.data);

/**
 * 行数据
 */
const rows = computed<Row[]>(() => {
  return Array.isArray(props.data) ? props.data : [props.data];
});

/**
 * 是否是数组数据
 */
const isArrayData = computed(() => Array.isArray(props.data));

/**
 * 获取描述项属性
 * @param item 描述项
 * @returns 描述项属性
 */
const getItemProps = (item: ColumnProps) => {
  const { label, prop, copy, cellRenderer, labelRenderer, ...rest } = item;
  return { label, ...rest };
};

/**
 * 获取值
 * @param row 行数据
 * @param item 描述项
 * @returns 值
 */
const getValue = (row: Row, item: ColumnProps) => {
  return get(row, item.prop);
};

/**
 * 获取行键
 * @param row 行数据
 * @param index 索引
 * @returns 行键
 */
const getRowKey = (row: Row, index: number): RowKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  const key = props.rowKey;
  const v = key ? row?.[key] : undefined;
  return (v ?? index) as RowKey;
};

/**
 * 是否可以复制
 * @param value 值
 * @returns 是否可以复制
 */
const canCopy = (value: any) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};

/**
 * 格式化值
 * @param value 值
 * @returns 格式化后的值
 */
const formatValue = (value: any) => {
  if (value === undefined || value === null || value === '') return props.placeholder;
  return value;
};

/**
 * 复制
 * @param text 文本
 */
const handleCopy = (text: any) => {
  if (!canCopy(text)) return;

  let copyText: string;
  if (typeof text === 'object') {
    try {
      copyText = JSON.stringify(text);
    } catch {
      copyText = String(text);
    }
  } else {
    copyText = String(text);
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => message('复制成功', { type: 'success' }))
      .catch(() => message('复制失败', { type: 'error' }));
  } else {
    message('当前浏览器不支持复制功能', { type: 'warning' });
  }
};
</script>

<style scoped>
.re-description__cell {
  display: inline-flex;
  align-items: center;
}

.re-description__copy-icon {
  margin-left: 4px;
  cursor: pointer;
}
</style>
