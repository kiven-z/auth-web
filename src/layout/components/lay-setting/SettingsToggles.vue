<script lang="ts" setup>
import { patchConfigureField } from '@/layout/hooks/configure/useUiConfigure';
import { getConfigureSnapshot } from '@/core/preferences/persistence/storage';
import { nextTick, onBeforeMount, reactive, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const configureSnapshot = getConfigureSnapshot();

const logoVal = ref(configureSnapshot.showLogo ?? true);

const settings = reactive({
  greyVal: configureSnapshot.grey,
  weakVal: configureSnapshot.weak,
  tabsVal: configureSnapshot.hideTabs,
  hideFooter: configureSnapshot.hideFooter,
  multiTagsCache: configureSnapshot.multiTagsCache,
});

/**
 * 灰色模式
 * @param value 是否开启
 */
function greyChange(value: boolean): void {
  patchConfigureField({ grey: value });
}

/**
 * 色弱模式
 * @param value 是否开启
 */
function weakChange(value: boolean): void {
  patchConfigureField({ weak: value });
}

/** 隐藏标签页 */
function tagsChange(): void {
  patchConfigureField({ hideTabs: settings.tabsVal });
}

/** 隐藏页脚 */
function hideFooterChange(): void {
  patchConfigureField({ hideFooter: settings.hideFooter });
}

/** 标签页持久化 */
function multiTagsCacheChange(): void {
  patchConfigureField({ multiTagsCache: settings.multiTagsCache });
}

/** 侧边栏 Logo */
function logoChange(): void {
  patchConfigureField({ showLogo: unref(logoVal) });
}

onBeforeMount(() => {
  nextTick(() => {
    settings.greyVal && document.querySelector('html')?.classList.add('html-grey');
    settings.weakVal && document.querySelector('html')?.classList.add('html-weakness');
    settings.tabsVal && tagsChange();
    settings.hideFooter && hideFooterChange();
  });
});
</script>

<template>
  <div>
    <p class="mt-5! font-medium text-sm dark:text-white">
      {{ t('panel.interfaceDisplay') }}
    </p>
    <ul class="settings-toggles">
      <li>
        <span class="dark:text-white">{{ t('panel.greyModel') }}</span>
        <el-switch
          v-model="settings.greyVal"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="greyChange"
        />
      </li>
      <li>
        <span class="dark:text-white">{{ t('panel.weakModel') }}</span>
        <el-switch
          v-model="settings.weakVal"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="weakChange"
        />
      </li>
      <li>
        <span class="dark:text-white">{{ t('panel.hiddenTags') }}</span>
        <el-switch
          v-model="settings.tabsVal"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="tagsChange"
        />
      </li>
      <li>
        <span class="dark:text-white">{{ t('panel.hiddenFooter') }}</span>
        <el-switch
          v-model="settings.hideFooter"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="hideFooterChange"
        />
      </li>
      <li>
        <span class="dark:text-white">Logo</span>
        <el-switch
          v-model="logoVal"
          :active-text="t('buttons.switchOnText')"
          :active-value="true"
          :inactive-text="t('buttons.switchOffText')"
          :inactive-value="false"
          inline-prompt
          @change="logoChange"
        />
      </li>
      <li>
        <span class="dark:text-white">
          {{ t('panel.multiTagsCache') }}
        </span>
        <el-switch
          v-model="settings.multiTagsCache"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="multiTagsCacheChange"
        />
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
