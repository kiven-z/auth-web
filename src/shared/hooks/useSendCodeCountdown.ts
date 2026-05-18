import { useCountdown } from '@vueuse/core';
import { computed } from 'vue';

/** 发送验证码按钮冷却时间（秒） */
const SEND_CODE_COOLDOWN_SECONDS = 60;

/**
 * 登录页发送验证码倒计时。
 * 初始 remaining 为 0，表示可立即发送；startCountdown 后进入冷却。
 */
export function useSendCodeCountdown() {
  const { remaining, start } = useCountdown(0);

  const isCounting = computed(() => remaining.value > 0);

  const startCountdown = () => {
    start(SEND_CODE_COOLDOWN_SECONDS);
  };

  return { remaining, isCounting, startCountdown };
}
