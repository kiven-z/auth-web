<script lang="ts" setup>
import { useLayout } from '@/layout/hooks/layout/useLayout';
import MixTopMenu from '@/layout/shell/MixTopMenu.vue';
import HeaderToolbar from '@/layout/shell/HeaderToolbar.vue';
import { useAppStore } from '@/store/modules/app/app';
import { useI18n } from 'vue-i18n';
import LaySidebarBreadCrumb from '../components/lay-sidebar/components/SidebarBreadCrumb.vue';

import MenuFold from '~icons/ri/menu-fold-fill';
import MenuUnfold from '~icons/ri/menu-unfold-fill';

const { t } = useI18n();
const appStore = useAppStore();
const { layout } = useLayout();
</script>

<template>
  <div class="layout-navbar bg-white shadow-xs shadow-[rgba(0,21,41,0.08)]">
    <div
      v-if="appStore.device === 'mobile'"
      :title="appStore.sidebar.opened ? t('buttons.clickCollapse') : t('buttons.clickExpand')"
      class="px-3 mr-1 navbar-bg-hover layout-navbar__collapse"
      @click="appStore.toggleSideBar()"
    >
      <IconifyIconOffline
        :icon="appStore.sidebar.opened ? MenuFold : MenuUnfold"
        class="inline-block! align-middle hover:text-primary dark:hover:text-white!"
      />
    </div>

    <LaySidebarBreadCrumb v-if="layout !== 'mix' && appStore.device !== 'mobile'" class="layout-navbar__breadcrumb" />

    <MixTopMenu v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="layout-navbar__toolbar">
      <HeaderToolbar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .layout-navbar__collapse {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .layout-navbar__toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;
  }

  .layout-navbar__breadcrumb {
    float: left;
    margin-left: 16px;
  }
}
</style>
