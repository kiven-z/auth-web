<script lang="tsx" setup>
import { EmailTemplateRequireFieldRow } from '@/api/system/email-template';
import { message } from '@/shared/messaging/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 可编辑行（exampleValue 用 JSON 字符串编辑，提交时解析）
 */
interface EditableRow {
  _id: number;
  key: string;
  description: string;
  exampleValueJson: string;
}

interface Props {
  /** 模板主键 */
  templateId: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const emailTemplateStore = useEmailTemplateStoreHook();

/** 加载详情中的 require_fields */
const loading = ref(false);
/** 可编辑行数据 */
const dataList = ref<EditableRow[]>([]);
/** 行内部 _id 自增，保证 row-key 唯一 */
let rowSeq = 1;

/**
 * 解析到 dataList 中的真实行，避免表格内部副本导致 v-model 不同步
 * @param row 当前渲染行
 */
const resolveRow = (row: EditableRow) => dataList.value.find((r) => r._id === row._id) ?? row;

/** 必填变量表格列：内联编辑 + 删除操作槽 */
const columns: TableColumnList = [
  {
    label: t('system.emailTemplate.fieldKey'),
    prop: 'key',
    minWidth: 120,
    cellRenderer: ({ row }) => {
      const target = resolveRow(row);
      return (
        <el-input
          clearable
          modelValue={target.key}
          placeholder={t('system.emailTemplate.placeholder.fieldKey')}
          onUpdate:modelValue={(v: string) => {
            target.key = v;
          }}
        />
      );
    },
  },
  {
    label: t('system.emailTemplate.fieldDescription'),
    prop: 'description',
    minWidth: 140,
    cellRenderer: ({ row }) => {
      const target = resolveRow(row);
      return (
        <el-input
          clearable
          modelValue={target.description}
          placeholder={t('system.emailTemplate.placeholder.fieldDescription')}
          onUpdate:modelValue={(v: string) => {
            target.description = v;
          }}
        />
      );
    },
  },
  {
    label: t('system.emailTemplate.fieldExampleValue'),
    prop: 'exampleValueJson',
    minWidth: 200,
    cellRenderer: ({ row }) => {
      const target = resolveRow(row);
      return (
        <el-input
          modelValue={target.exampleValueJson}
          placeholder={t('system.emailTemplate.placeholder.fieldExampleValue')}
          rows={2}
          type="textarea"
          onUpdate:modelValue={(v: string) => {
            target.exampleValueJson = v;
          }}
        />
      );
    },
  },
  {
    label: t('common.table.operation'),
    fixed: 'right',
    width: 90,
    slot: 'operation',
  },
];

/** 追加一行空变量 */
const onAdd = () => {
  dataList.value.push({
    _id: rowSeq++,
    key: '',
    description: '',
    exampleValueJson: '',
  });
};

/**
 * 删除一行
 * @param row 要删除的行
 */
const onDel = (row: EditableRow) => {
  const i = dataList.value.indexOf(row);
  if (i !== -1) dataList.value.splice(i, 1);
};

/**
 * 构建提交 payload；校验 key 唯一与 JSON 合法性
 */
const buildPayload = (): EmailTemplateRequireFieldRow[] | null => {
  const keys = dataList.value.map((r) => r.key.trim()).filter(Boolean);
  if (keys.length !== new Set(keys).size) {
    message(t('system.emailTemplate.requireFieldKeyDuplicate'), { type: 'warning' });
    return null;
  }
  const rows: EmailTemplateRequireFieldRow[] = [];
  for (const r of dataList.value) {
    const k = r.key.trim();
    if (!k) {
      message(t('system.emailTemplate.requireFieldKeyRequired'), { type: 'warning' });
      return null;
    }
    let exampleValue: unknown;
    const raw = r.exampleValueJson?.trim() ?? '';
    if (raw === '') {
      message(t('system.emailTemplate.requireFieldExampleRequired'), { type: 'warning' });
      return null;
    }
    try {
      exampleValue = JSON.parse(raw);
    } catch {
      exampleValue = raw;
    }
    rows.push({
      key: k,
      description: r.description?.trim() || undefined,
      exampleValue,
    });
  }
  return rows;
};

/**
 * 供 ReDialog beforeSure：返回 true 表示已持久化并可关闭
 */
const submit = async (): Promise<boolean> => {
  const payload = buildPayload();
  if (!payload) return false;
  return emailTemplateStore.updateRequireFieldsOnly(props.templateId, payload);
};

onMounted(async () => {
  loading.value = true;
  try {
    const detail = await emailTemplateStore.fetchEmailTemplateDetail(props.templateId);
    const list = detail?.requireFields ?? [];
    dataList.value = list.map((r, i) => ({
      _id: i + 1,
      key: r.key,
      description: r.description ?? '',
      exampleValueJson: JSON.stringify(r.exampleValue),
    }));
    rowSeq = dataList.value.length + 1;
  } finally {
    loading.value = false;
  }
});

defineExpose({ submit });
</script>

<template>
  <div v-loading="loading" class="require-fields-dialog-inner">
    <el-table
      :data="dataList"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)',
      }"
      :row-key="(row: EditableRow) => String(row._id)"
      border
      class="w-full"
    >
      <el-table-column :label="t('emailTemplate.fieldKey')" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.key" :placeholder="t('emailTemplate.placeholder.fieldKey')" clearable />
        </template>
      </el-table-column>
      <el-table-column :label="t('emailTemplate.fieldDescription')" min-width="140">
        <template #default="{ row }">
          <el-input
            v-model="row.description"
            :placeholder="t('emailTemplate.placeholder.fieldDescription')"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('emailTemplate.fieldExampleValue')" min-width="200">
        <template #default="{ row }">
          <el-input
            v-model="row.exampleValueJson"
            :placeholder="t('emailTemplate.placeholder.fieldExampleValue')"
            :rows="2"
            type="textarea"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('table.actions')" align="center" fixed="right" width="100">
        <template #default="{ row }">
          <el-button link type="danger" @click="onDel(row)">{{ t('buttons.actionDelete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="w-full mt-2" plain @click="onAdd">{{ t('buttons.actionAdd') }}</el-button>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;
}
</style>
