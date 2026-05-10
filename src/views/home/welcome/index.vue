<script lang="tsx" setup>
import { useI18n } from 'vue-i18n';
import { addDrawer } from '@/components/ui/Drawer';

const { t } = useI18n();
defineOptions({
  name: 'AuthWelcome',
});

const open = () => {
  addDrawer({
    title: '基础用法',
    contentRenderer: () => <p>抽屉内容-基础用法</p>,
    openDelay: 500,
  });
};
</script>

<template>
  <div class="w-full">
    <h1 class="text-amber-700" @click="open">Language： {{ t('menus.pureHome') }}</h1>
    <el-button type="primary" @click="open">抽屉</el-button>
  </div>
</template>
