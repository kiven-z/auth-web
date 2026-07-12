<script lang="ts" setup>
import type { MessageChannelCode, MessageTemplateRequireFieldRow } from '@/api/message/message-template';
import { getMessageTemplateById, updateMessageTemplateRequireFields } from '@/api/message/message-template';
import { errorMessage, message } from '@/services/feedback/message';
import { MESSAGE_TEMPLATE_PERMS } from '@/views/message/_shared/constants/permissions';
import {
  type EditableRequireFieldRow,
  toEditableRequireFields,
  toRequireFieldsPayload,
} from '@/views/message/_shared/utils/require-fields';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateRequireFieldsDialog',
});

/** 消息模板变量表编辑弹窗 props */
interface MessageTemplateRequireFieldsDialogProps {
  templateId: string;
  channel: MessageChannelCode;
  /** 打开方已拉取的变量表初始数据 */
  initialRequireFields?: MessageTemplateRequireFieldRow[];
  /** 加载失败默认 i18n key */
  loadFailedI18nKey?: string;
}

const props = withDefaults(defineProps<MessageTemplateRequireFieldsDialogProps>(), {
  initialRequireFields: () => [],
  loadFailedI18nKey: 'messageTemplate.loadFailed',
});

const { t } = useI18n();

const loading = ref(false);
const dataList = ref<EditableRequireFieldRow[]>([]);
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
 * @param row 待删除行
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
  const transformResult = toRequireFieldsPayload(dataList.value);
  if (!transformResult.ok) {
    message(t(transformResult.error.messageKey), { type: 'warning' });
    return false;
  }

  try {
    await updateMessageTemplateRequireFields(props.templateId, props.channel, {
      requireFields: transformResult.payload,
    });
    message(t('tips.editSuccess'), { type: 'success' });
    return true;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: props.loadFailedI18nKey });
    return false;
  }
};

onMounted(async () => {
  loading.value = true;

  try {
    const detail = await getMessageTemplateById(props.templateId, props.channel);
    dataList.value = toEditableRequireFields(detail?.requireFields ?? props.initialRequireFields);
    rowSeq = dataList.value.length + 1;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: props.loadFailedI18nKey });
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
      <el-table-column :label="t('messageTemplate.fieldKey')" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.key" :placeholder="t('messageTemplate.placeholder.fieldKey')" clearable />
        </template>
      </el-table-column>
      <el-table-column :label="t('messageTemplate.fieldDescription')" min-width="140">
        <template #default="{ row }">
          <el-input
            v-model="row.description"
            :placeholder="t('messageTemplate.placeholder.fieldDescription')"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('messageTemplate.fieldExampleValue')" min-width="200">
        <template #default="{ row }">
          <el-input
            v-model="row.exampleValueJson"
            :autosize="{ minRows: 1, maxRows: 4 }"
            :placeholder="t('messageTemplate.placeholder.fieldExampleValue')"
            type="textarea"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('table.actions')" align="center" fixed="right" width="100">
        <template #default="{ row }">
          <el-button v-perms="MESSAGE_TEMPLATE_PERMS.UPDATE" link type="danger" @click="onDel(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-perms="MESSAGE_TEMPLATE_PERMS.UPDATE" class="w-full mt-2" plain @click="onAdd">
      {{ t('buttons.actionAdd') }}
    </el-button>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;
}
</style>
