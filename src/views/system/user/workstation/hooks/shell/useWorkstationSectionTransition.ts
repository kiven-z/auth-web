import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

import { USER_WORKSTATION_DEFAULT_SECTION, type UserWorkstationNavGroupConfig } from './useWorkstationNav';

const ANIMATE_PREFIX = 'animate__animated';

/** 往下切：轻量淡出上移 / 淡入上移 */
const DOWN_ENTER = `${ANIMATE_PREFIX} animate__fadeInUp`;
const DOWN_LEAVE = `${ANIMATE_PREFIX} animate__fadeOutUp`;

/** 往上切：轻量淡出下移 / 淡入下移 */
const UP_ENTER = `${ANIMATE_PREFIX} animate__fadeInDown`;
const UP_LEAVE = `${ANIMATE_PREFIX} animate__fadeOutDown`;

/**
 * 按侧栏菜单顺序推导分区切换方向，产出 animate.css 进/离场类
 * @param navGroups 可见侧栏分组
 * @returns enter / leave active class
 */
function useWorkstationSectionTransition(navGroups: ComputedRef<UserWorkstationNavGroupConfig[]>): {
  enterActiveClass: Ref<string>;
  leaveActiveClass: Ref<string>;
} {
  const enterActiveClass = ref(DOWN_ENTER);
  const leaveActiveClass = ref(DOWN_LEAVE);

  const sectionOrder = computed(() => navGroups.value.flatMap((group) => group.items.map((item) => item.key)));

  /**
   * 按菜单顺序比较方向并更新进离场类
   * @param fromSection 离开分区
   * @param toSection 进入分区
   */
  function applyDirection(fromSection: string, toSection: string) {
    if (fromSection === toSection) {
      return;
    }
    const fromIndex = sectionOrder.value.findIndex((key) => key === fromSection);
    const toIndex = sectionOrder.value.findIndex((key) => key === toSection);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const goingDown = toIndex > fromIndex;
    enterActiveClass.value = goingDown ? DOWN_ENTER : UP_ENTER;
    leaveActiveClass.value = goingDown ? DOWN_LEAVE : UP_LEAVE;
  }

  onBeforeRouteUpdate((to, from) => {
    applyDirection(
      from.path.split('/').pop() || USER_WORKSTATION_DEFAULT_SECTION,
      to.path.split('/').pop() || USER_WORKSTATION_DEFAULT_SECTION
    );
  });

  return { enterActiveClass, leaveActiveClass };
}

export default useWorkstationSectionTransition;
