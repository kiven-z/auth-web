import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import type { PreferenceModule } from '@/core/preferences/registry';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

/** 色弱模式与隐藏页脚 */
export const displayModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.DISPLAY,

  serialize() {
    return omitBy({ ...useDisplayPreferencesStore().$state }, isUndefined);
  },

  hydrate(value) {
    const store = useDisplayPreferencesStore();
    const patch = Object.fromEntries(
      Object.keys(store.$state)
        .filter((key) => !isUndefined(value[key]))
        .map((key) => [key, value[key]])
    );
    if (Object.keys(patch).length > 0) {
      store.$patch(patch);
    }
  },

  resetLocal() {
    useDisplayPreferencesStore().$reset();
  },
};
