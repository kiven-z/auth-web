import { hasAuth } from './hasAuth';
import { defineComponent, Fragment } from 'vue';

export default defineComponent({
  name: 'Perms',
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
