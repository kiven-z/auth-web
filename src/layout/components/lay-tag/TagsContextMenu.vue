<script lang="ts" setup>
import type { tagsViewsType } from '../../types';
import type { CSSProperties } from 'vue';

interface Props {
  visible: boolean;
  menuStyle: CSSProperties;
  tagsViews: Array<tagsViewsType>;
}

interface Emits {
  (event: 'select', key: number, item: tagsViewsType): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 右键菜单项点击
 * @param key 索引
 * @param item 菜单项
 */
function handleSelect(key: number, item: tagsViewsType): void {
  emit('select', key, item);
}
</script>

<template>
  <transition name="el-zoom-in-top">
    <ul v-show="visible" :key="Math.random()" :style="menuStyle" class="tags-context-menu">
      <div v-for="(item, key) in tagsViews.slice(0, 6)" :key="key" style="display: flex; align-items: center">
        <li v-if="item.show" @click="handleSelect(key, item)">
          <IconifyIconOffline :icon="item.icon" />
          <slot :item="item" name="label">
            {{ item.text }}
          </slot>
        </li>
      </div>
    </ul>
  </transition>
</template>

<style lang="scss" scoped>
.tags-context-menu {
  position: absolute;
  padding: 5px 0;
  margin: 0;
  font-size: 13px;
  font-weight: normal;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  outline: 0;
  list-style-type: none;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);

  li {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 7px 12px;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }

    svg {
      display: block;
      margin-right: 0.5em;
    }
  }
}
</style>
