<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ErrorPageActions',
});

const { t } = useI18n();
const router = useRouter();

/**
 * 返回浏览器上一页。
 */
function goBack() {
  router.back();
}

/**
 * 回到欢迎首页。
 */
function goHome() {
  void router.push({ name: 'Welcome' });
}
</script>

<template>
  <div class="error-page-actions">
    <!-- 返回上一页 -->
    <el-button
      v-motion
      :enter="{ opacity: 1, y: 0, transition: { delay: 160 } }"
      :initial="{ opacity: 0, y: 100 }"
      type="primary"
      @click="goBack"
    >
      {{ t('errorPage.back') }}
    </el-button>

    <!-- 返回首页 -->
    <el-button
      v-motion
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      :initial="{ opacity: 0, y: 100 }"
      @click="goHome"
    >
      {{ t('errorPage.backHome') }}
    </el-button>
  </div>
</template>

<style scoped>
.error-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

@media (min-width: 768px) {
  .error-page-actions {
    justify-content: flex-start;
  }
}
</style>
