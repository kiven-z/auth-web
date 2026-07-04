<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { FileRecordDetail } from '@/api/file/file-record';
import Description from '@/components/ui/Description';
import { formatFileSize } from '@/shared/utils/file/fileSize';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'FileRecordDescriptionDialog',
});

type FileRecordDescriptionDialogProps = DetailDialog<FileRecordDetail>;

defineProps<FileRecordDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('fileRecord.fields.originalName'), prop: 'originalName', labelWidth: 120, copy: true },
  { label: t('fileRecord.fields.extension'), prop: 'extension', labelWidth: 120 },
  { label: t('fileRecord.fields.storagePlatform'), prop: 'storagePlatform', labelWidth: 120 },
  { label: t('fileRecord.fields.uploadMode'), prop: 'uploadMode', labelWidth: 120 },
  {
    label: t('fileRecord.fields.size'),
    prop: 'size',
    labelWidth: 120,
    cellRenderer: ({ value }: { value?: number | null }) => <span>{formatFileSize(value ?? undefined)}</span>,
  },
  { label: t('fileRecord.fields.contentType'), prop: 'contentType', labelWidth: 120 },
  { label: t('fileRecord.fields.bucket'), prop: 'bucket', labelWidth: 120, span: 2, copy: true },
  { label: t('fileRecord.fields.objectKey'), prop: 'objectKey', labelWidth: 120, span: 2, copy: true },
  {
    label: t('fileRecord.fields.url'),
    prop: 'url',
    labelWidth: 120,
    span: 2,
    copy: true,
  },
  {
    label: t('fileRecord.fields.accessUrl'),
    prop: 'accessUrl',
    labelWidth: 120,
    span: 2,
    copy: true,
  },
  { label: t('fileRecord.fields.etag'), prop: 'etag', labelWidth: 120 },
  { label: t('fileRecord.fields.bizType'), prop: 'bizType', labelWidth: 120 },
  { label: t('fileRecord.fields.bizId'), prop: 'bizId', labelWidth: 120 },
  { label: t('fileRecord.fields.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
