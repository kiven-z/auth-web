<script lang="ts" setup>
import type { MenuForm } from '@/types/system';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  form: { type: Object as PropType<MenuForm>, required: true },
  formDisabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:form']);

const { t } = useI18n();

// 表单内容
const formModel = computed({
  get: () => props.form,
  set: (value) => emit('update:form', value),
});
</script>

<template>
  <el-row :gutter="14" class="w-full">
    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.component')" prop="component">
        <el-input
          v-model="formModel.component"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.component')"
          clearable
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.redirect')" prop="redirect">
        <el-input
          v-model="formModel.redirect"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.redirect')"
          clearable
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.activePath')" prop="activePath">
        <el-input
          v-model="formModel.activePath"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.activePath')"
          clearable
        />
      </el-form-item>
    </el-col>

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
      <el-form-item :label="t('menus.keepAlive')" prop="keepAlive">
        <el-switch
          v-model="formModel.keepAlive"
          :active-text="t('common.status.cache')"
          :disabled="formDisabled"
          :inactive-text="t('common.status.unCache')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.hiddenTag')" prop="hiddenTag">
        <el-switch
          v-model="formModel.hiddenTag"
          :active-text="t('common.buttons.forbidText')"
          :disabled="formDisabled"
          :inactive-text="t('common.buttons.permitText')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.fixedTag')" prop="fixedTag">
        <el-switch
          v-model="formModel.fixedTag"
          :active-text="t('common.buttons.fixedText')"
          :disabled="formDisabled"
          :inactive-text="t('common.buttons.unFixedText')"
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

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.dynamicLevel')" prop="dynamicLevel">
        <el-input-number
          v-model="formModel.dynamicLevel"
          :disabled="formDisabled"
          :max="999"
          :min="1"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>
