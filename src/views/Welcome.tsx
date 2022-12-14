import { defineComponent, ref, Transition, VNode, watchEffect } from "vue";
import { RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter } from "vue-router";
import s from "./Welcome.module.scss";
import { useSwipe } from "../hooks/useSwipe";
import { throttle } from "../shared/throttle";
import { Icon } from "../shared/Icon";

const pushMapLeft: Record<string, string> = {
  Welcome1: "/welcome/2",
  Welcome2: "/welcome/3",
  Welcome3: "/welcome/4",
  Welcome4: "/items",
};
const pushMapRight: Record<string, string> = {
  Welcome1: "/welcome/1",
  Welcome2: "/welcome/1",
  Welcome3: "/welcome/2",
  Welcome4: "/welcome/3",
};

export const Welcome = defineComponent({
  setup: (props, context) => {
    const main = ref<HTMLElement>();
    const { direction, swiping } = useSwipe(main, { beforeStart: (e) => e.preventDefault() });
    const route = useRoute();
    const router = useRouter();
    const pushLeft = throttle(() => {
      const nameForLeft = (route.name || "Welcome1").toString();
      router.push(pushMapLeft[nameForLeft]);
    }, 500);
    const pushRight = throttle(() => {
      const nameForRight = (route.name || "Welcome1").toString();
      router.push(pushMapRight[nameForRight]);
    }, 500);

    watchEffect(() => {
      if (swiping.value && direction.value === "left") {
        pushLeft();
      } else if (swiping.value && direction.value === "right") {
        pushRight();
      }
    });

    return () => (
      <div class={s.wrapper}>
        <header>
          <Icon name="logo" class={s.icon} />
          <h1 class={s.appName}>点滴记账</h1>
        </header>
        <main class={s.main} ref={main}>
          <RouterView name="main">
            {({
              Component: X,
              route: R,
            }: {
              Component: VNode;
              route: RouteLocationNormalizedLoaded;
            }) => (
              <Transition
                enterFromClass={s.slide_fade_enter_from}
                enterActiveClass={s.slide_fade_enter_active}
                leaveToClass={s.slide_fade_leave_to}
                leaveActiveClass={s.slide_fade_leave_active}
              >
                {X}
              </Transition>
            )}
          </RouterView>
        </main>
        <footer>
          <RouterView name="footer" />
        </footer>
      </div>
    );
  },
});

export default Welcome;
