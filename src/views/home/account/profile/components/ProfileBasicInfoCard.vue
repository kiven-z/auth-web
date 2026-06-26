<script lang="ts" setup>
import type { SysUserProfileResponse } from '@/api/system/user-base';
import ReDescription from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileBasicInfoCard',
});

const props = defineProps<{
  profile: SysUserProfileResponse;
}>();
const { t } = useI18n();

const accountBasicInfoColumns = [
  { label: t('account.field.username'), prop: 'username' },
  { label: t('account.field.nickname'), prop: 'nickname' },
  { label: t('account.field.email'), prop: 'email' },
  { label: t('account.field.phone'), prop: 'phone' },
  { label: t('account.field.employeeNo'), prop: 'employeeNo' },
];
const profileRows = computed(() => [props.profile]);
</script>

<template>
  <ReDescription :column="2" :columns="accountBasicInfoColumns" :data="profileRows" border class="overflow-x-auto" />
</template>
