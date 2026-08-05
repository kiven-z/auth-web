<script lang="ts" setup>
import ButtonStatesSection from './components/ButtonStatesSection.vue';
import ColorPaletteSection from './components/ColorPaletteSection.vue';
import FormFillSection from './components/FormFillSection.vue';
import LoadingMaskSection from './components/LoadingMaskSection.vue';
import OverlaySection from './components/OverlaySection.vue';
import SemanticSurfacesSection from './components/SemanticSurfacesSection.vue';
import TableHighlightSection from './components/TableHighlightSection.vue';
import ThemeLabToolbar from './components/ThemeLabToolbar.vue';

defineOptions({
  name: 'AuthWelcome',
});
</script>

<template>
  <div class="theme-lab">
    <header class="theme-lab__header">
      <h1 class="theme-lab__title">色阶冒烟（开发期）</h1>
      <p class="theme-lab__desc">
        验 token → map-element → EP 组件。亮/暗 + 换主色三刀扫；壳层（侧栏/标签页）请用设置面板。
      </p>
    </header>

    <ThemeLabToolbar />

    <div class="theme-lab__sections">
      <ColorPaletteSection />
      <ButtonStatesSection />
      <SemanticSurfacesSection />
      <FormFillSection />
      <TableHighlightSection />
      <LoadingMaskSection />
      <OverlaySection />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-lab {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-bg_color);
  overflow: auto;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    margin: 0;
    font-size: var(--auth-font-size-headline);
    font-weight: 600;
    color: var(--auth-text-primary);
  }

  &__desc {
    margin: 0;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-placeholder);
  }

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
