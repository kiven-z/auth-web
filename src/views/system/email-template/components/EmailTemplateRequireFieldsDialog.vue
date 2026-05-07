<!--
  维护 require_fields 变量表
-->
<script lang="ts" setup>
import { getEmailTemplateById, updateEmailTemplateRequireFields } from '@/api/system/email-template';
import { errorMessage, message } from '@/shared/messaging/message';
import {
  toEditableRequireFields,
  toRequireFieldsPayload,
  type EditableRequireFieldRow,
} from '@/views/system/email-template/utils/require-fields';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  templateId: string;
}

const props = defineProps<Props>();
const { t } = useI18n();

const loading = ref(false);
const dataList = ref<EditableRequireFieldRow[]>([]);
let rowSeq = 1;

const onAdd = () => {
  dataList.value.push({
    _id: rowSeq++,
    key: '',
    description: '',
    exampleValueJson: '',
  });
};

const onDel = (row: EditableRequireFieldRow) => {
  const i = dataList.value.indexOf(row);
  if (i !== -1) dataList.value.splice(i, 1);
};

const submit = async (): Promise<boolean> => {
  const transformResult = toRequireFieldsPayload(dataList.value);
  if (!transformResult.ok) {
    message(t(transformResult.error.messageKey), { type: 'warning' });
    return false;
  }
  try {
    await updateEmailTemplateRequireFields(props.templateId, { requireFields: transformResult.payload });
    message(t('tips.editSuccess'), { type: 'success' });
    return true;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    return false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const detail = await getEmailTemplateById(props.templateId);
    dataList.value = toEditableRequireFields(detail?.requireFields ?? []);
    rowSeq = dataList.value.length + 1;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
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
      :row-key="(row: EditableRequireFieldRow) => String(row._id)"
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
