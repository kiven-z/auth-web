<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { InAppMessageCategoryFormModel } from '@/api/message/in-app-category';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import useInAppCategoryMajorOptions from '@/views/message/_shared/hooks/useInAppCategoryMajorOptions';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryFormDialog',
});

const props = withDefaults(defineProps<FormDialog<InAppMessageCategoryFormModel>>(), {
  form: () => ({}) as InAppMessageCategoryFormModel,
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const formRef = ref<FormInstance>();

const form = ref<InAppMessageCategoryFormModel>({
  sortOrder: 0,
  status: true,
  ...props.form,
});

const { majorOptions, loadingMajors, loadMajors } = useInAppCategoryMajorOptions('ALL');

/** 编辑时排除自身，避免选自己当父级 */
const selectableMajorOptions = computed(() => majorOptions.value.filter((item) => item.id !== form.value.id));

const rules = reactive<FormRules>({
  code: [
    { required: true, message: ph.input('inAppCategory.field.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: t('inAppCategory.rules.codePattern'),
      trigger: 'change',
    },
  ],
  name: [{ required: true, message: ph.input('inAppCategory.field.name'), trigger: 'blur' }],
  status: [{ required: true, message: ph.select('inAppCategory.field.status'), trigger: 'change' }],
});

onMounted(() => {
  loadMajors();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 父分类：空=大类；选中大类=小类 -->
      <el-col :span="24">
        <el-form-item :label="t('inAppCategory.field.parentName')" prop="parentId">
          <el-select
            v-model="form.parentId"
            :loading="loadingMajors"
            :placeholder="ph.select('inAppCategory.field.parentName')"
            class="w-full"
            clearable
            filterable
          >
            <el-option
              v-for="item in selectableMajorOptions"
              :key="item.id"
              :label="`${item.name} (${item.code})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <!-- 分类码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.code')" prop="code">
          <el-input
            v-model="form.code"
            :placeholder="ph.input('inAppCategory.field.code')"
            autocomplete="off"
            clearable
            maxlength="64"
          />
        </el-form-item>
      </el-col>

      <!-- 展示名 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="ph.input('inAppCategory.field.name')"
            autocomplete="off"
            clearable
            maxlength="128"
          />
        </el-form-item>
      </el-col>

      <!-- 排序 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.sortOrder')" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" class="w-full!" controls-position="right" />
        </el-form-item>
      </el-col>

      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-text="t('buttons.statusActiveText')"
            :active-value="true"
            :inactive-text="t('buttons.statusInactiveText')"
            :inactive-value="false"
            inline-prompt
            style="--el-switch-on-color: var(--el-color-success); --el-switch-off-color: var(--el-color-danger)"
          />
        </el-form-item>
      </el-col>

      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('inAppCategory.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="ph.input('inAppCategory.field.remark')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
