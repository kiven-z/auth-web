<script lang="ts" setup>
import type { AuthorizationAuditDetailRow } from '@/api/log/authorization-audit';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationAuditDetailDialog',
});

const props = defineProps<{ data: AuthorizationAuditDetailRow }>();
const { t } = useI18n();

const columns = computed(() => [
  // 事件类型
  { label: t('authorizationAudit.eventType'), prop: 'eventType', labelWidth: 120 },
  // 会话 ID
  { label: t('authorizationAudit.sessionId'), prop: 'sessionId', labelWidth: 120, copy: true },
  // 所需权限码
  { label: t('authorizationAudit.requiredPermission'), prop: 'requiredPermission', labelWidth: 120, copy: true },
  // HTTP 方法
  { label: t('authorizationAudit.requestMethod'), prop: 'requestMethod', labelWidth: 120 },
  // 请求 URI
  { label: t('authorizationAudit.requestUri'), prop: 'requestUri', labelWidth: 120, copy: true },
  // 请求 IP
  { label: t('authorizationAudit.requestIp'), prop: 'requestIp', labelWidth: 120, copy: true },
  // 决策原因
  { label: t('authorizationAudit.decisionReason'), prop: 'decisionReason', labelWidth: 120 },
  // 决策详情
  { label: t('authorizationAudit.decisionDetail'), prop: 'decisionDetail', labelWidth: 120, copy: true },
  // 用户权限摘要
  { label: t('authorizationAudit.userPermissionsSummary'), prop: 'userPermissionsSummary', labelWidth: 120 },
  // 策略编码
  { label: t('authorizationAudit.policyCode'), prop: 'policyCode', labelWidth: 120, copy: true },
  // 策略决策结果
  { label: t('authorizationAudit.policyDecision'), prop: 'policyDecision', labelWidth: 120 },
  // Controller 类名
  { label: t('authorizationAudit.className'), prop: 'className', labelWidth: 120, copy: true },
  // 方法名
  { label: t('authorizationAudit.methodName'), prop: 'methodName', labelWidth: 120, copy: true },
  // 方法参数
  { label: t('authorizationAudit.methodParams'), prop: 'methodParams', labelWidth: 120 },
  // 异常消息
  { label: t('authorizationAudit.exceptionMessage'), prop: 'exceptionMessage', labelWidth: 120 },
  // 备注
  { label: t('authorizationAudit.remark'), prop: 'remark', labelWidth: 120, copy: true },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);

const view = computed(() => {
  return props.data || ({} as AuthorizationAuditDetailRow);
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" />
</template>
