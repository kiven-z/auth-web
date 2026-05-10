<script lang="ts" setup>
import { MenuForm } from '@/types/system';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  form: { type: Object as PropType<MenuForm>, required: true },
  formDisabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:form']);

const { t } = useI18n();

const formModel = computed({
  get: () => props.form,
  set: (value) => emit('update:form', value),
});
</script>

<template>
  <el-row :gutter="14" class="w-full">
    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.showLink')" prop="showLink">
        <el-switch
          v-model="formModel.showLink"
          :active-text="t('common.status.show')"
          :disabled="formDisabled"
          :inactive-text="t('common.status.hide')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.showParent')" prop="showParent">
        <el-switch
          v-model="formModel.showParent"
          :active-text="t('common.status.show')"
          :disabled="formDisabled"
          :inactive-text="t('common.status.hide')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.status')" prop="status">
        <el-switch
          v-model="formModel.status"
          :active-text="t('common.buttons.statusActiveText')"
          :active-value="true"
          :disabled="formDisabled"
          :inactive-text="t('common.buttons.statusInactiveText')"
          :inactive-value="false"
          inline-prompt
          style="--el-switch-on-color: var(--el-color-success); --el-switch-off-color: var(--el-color-danger)"
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>
