import { hasAuth } from '@/auth/permission';
import { defineComponent, Fragment } from 'vue';

export default defineComponent({
  name: 'Auth',
  props: {
    value: {
      type: undefined,
      default: [],
    },
  },
  setup(props, { slots }) {
    return () => {
      if (!slots) return null;
      return hasAuth(props.value) ? <Fragment>{slots.default?.()}</Fragment> : null;
    };
  },
});
