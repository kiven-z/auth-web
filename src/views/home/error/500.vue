<script lang="ts" setup>
import { useRouter } from 'vue-router';
import noServer from '@/assets/status/500.svg?component';

defineOptions({
  name: '500',
});

const router = useRouter();
</script>

<template>
  <div class="flex flex-col md:flex-row justify-center items-center min-h-full w-full p-4 md:p-0">
    <noServer />
    <div class="mt-8 md:ml-12 md:mt-0 text-center md:text-left">
      <p
        v-motion
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80,
          },
        }"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        class="font-medium text-4xl mb-4! dark:text-white"
      >
        500
      </p>
      <p
        v-motion
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 120,
          },
        }"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        class="text-xl mb-4! text-gray-500"
      >
        抱歉，服务器出错了
      </p>
      <el-button
        v-motion
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160,
          },
        }"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        class="block mx-auto md:inline-block md:mx-0"
        type="primary"
        @click="router.push('/')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  margin: 0 !important;
}
</style>
