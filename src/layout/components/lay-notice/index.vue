<script lang="ts" setup>
import { useInAppInboxStoreHook } from '@/store/modules/inAppInbox';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BellIcon from '~icons/ep/bell';

defineOptions({
  name: 'LayNotice',
});

const { t } = useI18n();
const inboxStore = useInAppInboxStoreHook();
const { totalUnreadCount } = storeToRefs(inboxStore);

onMounted(() => {
  void inboxStore.refreshUnreadCount();
});
</script>

<template>
  <span
    :class="['notice-badge', 'navbar-bg-hover', 'select-none', totalUnreadCount > 0 && 'mr-2.5']"
    :title="t('inAppInbox.badgeTitle')"
    @click="$router.push('/inbox')"
  >
    <el-badge :hidden="totalUnreadCount <= 0" :max="99" :value="totalUnreadCount">
      <span class="notice-badge__icon">
        <IconifyIconOffline :icon="BellIcon" />
      </span>
    </el-badge>
  </span>
</template>

<style lang="scss" scoped>
.notice-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  &__icon {
    font-size: 18px;
  }
}
</style>
