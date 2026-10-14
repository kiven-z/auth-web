<script lang="ts" setup>
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useDisplayPreferencesStore();
const { weak, hideFooter } = storeToRefs(store);
</script>

<template>
  <div>
    <p class="settings-panel__title settings-panel__title--spaced">
      {{ t('panel.interfaceDisplay') }}
    </p>
    <ul class="settings-toggles">
      <li>
        <span>{{ t('panel.weakModel') }}</span>
        <el-switch v-model="weak" @change="(value: boolean) => store.setWeak(value)" />
      </li>
      <li>
        <span>{{ t('panel.hiddenFooter') }}</span>
        <el-switch v-model="hideFooter" @change="(value: boolean) => store.setHideFooter(value)" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__core) {
  --el-switch-off-color: var(--auth-switch-off-color);

  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

.settings-toggles {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
