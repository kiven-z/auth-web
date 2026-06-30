<script lang="ts" setup>
defineOptions({
  name: 'AccountActionRow',
});
</script>

<template>
  <section class="account-action-row">
    <div class="account-action-row__main">
      <el-text class="account-action-row__title" tag="b">
        <slot name="title" />
      </el-text>
      <el-text class="account-action-row__desc" type="info">
        <slot name="description" />
      </el-text>
    </div>
    <div class="account-action-row__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.account-action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &__main {
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 16px;
  }

  &__desc {
    display: block;
    margin-top: 4px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
}
</style>
