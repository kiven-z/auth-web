<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'HomePageToolbar',
});

const emit = defineEmits<{
  back: [];
}>();

const { t } = useI18n();
const router = useRouter();

/**
 * 回到欢迎页。
 */
function handleBackHome() {
  router.push({ name: 'Welcome' });
}
</script>

<template>
  <div class="home-page-toolbar">
    <el-button :icon="ArrowLeft" link type="primary" @click="emit('back')">
      {{ t('account.back') }}
    </el-button>

    <el-button link type="primary" @click="handleBackHome">
      {{ t('account.backHome') }}
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.home-page-toolbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}
</style>
