<script lang="ts" setup>
import {
  EmailTemplateRequireFieldRow,
  getEmailTemplateById,
  updateEmailTemplateRequireFields,
} from '@/api/system/email-template';
import { errorMessage, message } from '@/services/feedback/message';
import { EMAIL_TEMPLATE_PERMS } from '@/views/message/email-template/constants/permissions';
import {
  type EditableRequireFieldRow,
  toEditableRequireFields,
  toRequireFieldsPayload,
} from '@/views/message/email-template/utils/require-fields';
import { useMonacoTheme } from '@/shared/composables/monaco/useMonacoTheme';
import { CodeEditor } from 'monaco-editor-vue3';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'EmailTemplateRequireFieldsDialog',
});

/** 邮件模板变量表编辑弹窗 props */
interface EmailTemplateRequireFieldsDialogProps {
  templateId: string;
  /** 打开方已拉取的变量表初始数据 */
  initialRequireFields: EmailTemplateRequireFieldRow[];
}

const props = defineProps<EmailTemplateRequireFieldsDialogProps>();
const { t } = useI18n();
const monacoTheme = useMonacoTheme();

const loading = ref(false);
// 数据列表
const dataList = ref<EditableRequireFieldRow[]>([]);
// 行序号
let rowSeq = dataList.value.length + 1;

/**
 * 添加行
 */
const onAdd = () => {
  dataList.value.push({
    _id: rowSeq++,
    key: '',
    description: '',
    exampleValueJson: '',
  });
};

/**
 * 删除行
 * @param row 删除行
 * @returns 删除行后，更新行序号
 */
const onDel = (row: EditableRequireFieldRow) => {
  const index = dataList.value.indexOf(row);
  if (index !== -1) {
    dataList.value.splice(index, 1);
  }
};

/**
 * 校验并提交变量表
 * @returns 是否可关闭弹窗
 */
const submit = async (): Promise<boolean> => {
  // 转换为请求体
  const transformResult = toRequireFieldsPayload(dataList.value);
  // 转换失败
  if (!transformResult.ok) {
    message(t(transformResult.error.messageKey), { type: 'warning' });
    return false;
  }

  try {
    // 更新 require_fields
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
    // 获取详情
    const detail = await getEmailTemplateById(props.templateId);
    // 转换为可编辑行
    dataList.value = toEditableRequireFields(detail?.requireFields ?? []);
    // 更新行序号
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
          <div class="h-[200px]">
            <!-- <el-input -->
            <!--   v-model="row.exampleValueJson" -->
            <!--   :placeholder="t('emailTemplate.placeholder.fieldExampleValue')" -->
            <!--   :rows="2" -->
            <!--   type="textarea" -->
            <!-- /> -->
            <CodeEditor v-model:value="row.exampleValueJson" :theme="monacoTheme" language="json" />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('table.actions')" align="center" fixed="right" width="100">
        <template #default="{ row }">
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.UPDATE" link type="danger" @click="onDel(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-perms="EMAIL_TEMPLATE_PERMS.UPDATE" class="w-full mt-2" plain @click="onAdd">
      {{ t('buttons.actionAdd') }}
    </el-button>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;
}
</style>
