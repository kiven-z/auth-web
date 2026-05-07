<!--
  维护 require_fields 变量表
-->
<script lang="ts" setup>
import {
  getEmailTemplateById,
  updateEmailTemplateRequireFields,
  type EmailTemplateRequireFieldRow,
} from '@/api/system/email-template';
import { message } from '@/shared/messaging/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface EditableRow {
  _id: number;
  key: string;
  description: string;
  exampleValueJson: string;
}

interface Props {
  templateId: string;
}

const props = defineProps<Props>();
const { t } = useI18n();

const loading = ref(false);
const dataList = ref<EditableRow[]>([]);
let rowSeq = 1;

const onAdd = () => {
  dataList.value.push({
    _id: rowSeq++,
    key: '',
    description: '',
    exampleValueJson: '',
  });
};

const onDel = (row: EditableRow) => {
  const i = dataList.value.indexOf(row);
  if (i !== -1) dataList.value.splice(i, 1);
};

const buildPayload = (): EmailTemplateRequireFieldRow[] | null => {
  const keys = dataList.value.map((r) => r.key.trim()).filter(Boolean);
  if (keys.length !== new Set(keys).size) {
    message(t('emailTemplate.requireFieldKeyDuplicate'), { type: 'warning' });
    return null;
  }
  const rows: EmailTemplateRequireFieldRow[] = [];
  for (const r of dataList.value) {
    const k = r.key.trim();
    if (!k) {
      message(t('emailTemplate.requireFieldKeyRequired'), { type: 'warning' });
      return null;
    }
    const raw = r.exampleValueJson?.trim() ?? '';
    if (raw === '') {
      message(t('emailTemplate.requireFieldExampleRequired'), { type: 'warning' });
      return null;
    }
    let exampleValue: unknown;
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

const submit = async (): Promise<boolean> => {
  const payload = buildPayload();
  if (!payload) return false;
  try {
    await updateEmailTemplateRequireFields(props.templateId, { requireFields: payload });
    message(t('tips.editSuccess'), { type: 'success' });
    return true;
  } catch (error: unknown) {
    const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
    message(text, { type: 'error' });
    return false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const detail = await getEmailTemplateById(props.templateId);
    const list = detail?.requireFields ?? [];
    dataList.value = list.map((r, i) => ({
      _id: i + 1,
      key: r.key,
      description: r.description ?? '',
      exampleValueJson: JSON.stringify(r.exampleValue),
    }));
    rowSeq = dataList.value.length + 1;
  } catch (error: unknown) {
    const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
    message(text, { type: 'error' });
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
