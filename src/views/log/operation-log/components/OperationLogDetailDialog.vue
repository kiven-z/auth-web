<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { OperationLogDetailRow } from '@/api/log/operation-log';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'OperationLogDetailDialog',
});

type OperationLogDetailDialogProps = DetailDialog<OperationLogDetailRow>;

defineProps<OperationLogDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  // 操作用户 ID
  { label: t('operationLog.userId'), prop: 'userId', labelWidth: 120, copy: true },
  // 操作模块
  { label: t('operationLog.module'), prop: 'module', labelWidth: 120, copy: true },
  // 操作类型
  { label: t('operationLog.operationType'), prop: 'operationType', labelWidth: 120 },
  // 目标类型
  { label: t('operationLog.targetType'), prop: 'targetType', labelWidth: 120 },
  // 目标 ID
  { label: t('operationLog.targetId'), prop: 'targetId', labelWidth: 120, copy: true },
  // HTTP 方法
  { label: t('operationLog.requestMethod'), prop: 'requestMethod', labelWidth: 120 },
  // 请求 URI
  { label: t('operationLog.requestUri'), prop: 'requestUri', labelWidth: 120, copy: true },
  // 请求参数
  { label: t('operationLog.requestParams'), prop: 'requestParams', labelWidth: 120 },
  // 响应状态码
  { label: t('operationLog.responseStatus'), prop: 'responseStatus', labelWidth: 120 },
  // 响应消息
  { label: t('operationLog.responseMessage'), prop: 'responseMessage', labelWidth: 120 },
  // 执行耗时
  { label: t('operationLog.executionTimeMs'), prop: 'executionTimeMs', labelWidth: 120 },
  // 请求 IP
  { label: t('operationLog.ipAddress'), prop: 'ipAddress', labelWidth: 120, copy: true },
  // 用户代理
  { label: t('operationLog.userAgent'), prop: 'userAgent', labelWidth: 120 },
  // 备注
  { label: t('operationLog.remark'), prop: 'remark', labelWidth: 120, copy: true },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
