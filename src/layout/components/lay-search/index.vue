<script lang="ts" setup>
import { useBoolean } from '@/layout/hooks';
import SearchModal from './components/SearchModal.vue';

const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}
</script>

<template>
  <div>
    <div class="search-container w-10 h-12 flex-c cursor-pointer navbar-bg-hover" @click="handleSearch">
      <IconifyIconOffline icon="ri/search-line" />
    </div>
    <SearchModal v-model:value="show" />
  </div>
</template>
