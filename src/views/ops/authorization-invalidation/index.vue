<script lang="ts" setup>
import AuthorizationInvalidationEventTab from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationEventTab.vue';
import AuthorizationInvalidationOutboxTab from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationOutboxTab.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'OpsAuthorizationInvalidation',
});

const { t } = useI18n();
const activeTab = ref('event');
</script>

<template>
  <div class="bg-bg_color">
    <el-tabs v-model="activeTab" class="px-4 pt-2">
      <el-tab-pane :label="t('authorizationInvalidation.tabEvent')" name="event">
        <AuthorizationInvalidationEventTab />
      </el-tab-pane>

      <el-tab-pane :label="t('authorizationInvalidation.tabOutbox')" name="outbox">
        <AuthorizationInvalidationOutboxTab />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
