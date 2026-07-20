<script lang="ts" setup>
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';
import { IN_APP_CATEGORY_PERMS } from '@/views/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/views/message/in-app-category/hooks/useInAppCategoryPageState';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategorySearchForm',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const { loading, searchForm, fetchTreeData, resetQuery } = useInAppCategoryPageState();
</script>

<template>
  <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
    <!-- 分类码 -->
    <el-form-item :label="t('inAppCategory.field.code')" prop="code">
      <el-input v-model="searchForm.code" :placeholder="ph.input('inAppCategory.field.code')" class="w-45!" clearable />
    </el-form-item>
    <!-- 展示名 -->
    <el-form-item :label="t('inAppCategory.field.name')" prop="name">
      <el-input v-model="searchForm.name" :placeholder="ph.input('inAppCategory.field.name')" class="w-45!" clearable />
    </el-form-item>
    <!-- 启用状态 -->
    <el-form-item :label="t('inAppCategory.field.status')" prop="status">
      <el-select
        v-model="searchForm.status"
        :placeholder="ph.selectFilter('inAppCategory.field.status')"
        class="w-35!"
        clearable
      >
        <el-option
          v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
          :key="`${opt.labelKey}:${String(opt.value)}`"
          :label="t(opt.labelKey)"
          :value="opt.value"
        />
      </el-select>
    </el-form-item>
    <!-- 节点类型 -->
    <el-form-item :label="t('inAppCategory.field.rootOnly')" prop="rootOnly">
      <el-select
        v-model="searchForm.rootOnly"
        :placeholder="ph.selectFilter('inAppCategory.field.rootOnly')"
        class="w-35!"
        clearable
      >
        <el-option :label="t('inAppCategory.enum.rootOnly.major')" :value="true" />
        <el-option :label="t('inAppCategory.enum.rootOnly.minor')" :value="false" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button-group>
        <!-- 搜索 -->
        <el-button v-perms="IN_APP_CATEGORY_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTreeData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <!-- 重置 -->
        <el-button v-perms="IN_APP_CATEGORY_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>
