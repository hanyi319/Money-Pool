import s from "./welcome.module.scss";
import { defineComponent, FunctionalComponent, ref, watchEffect } from "vue";
import { useSwipe } from "../../hooks/useSwipe";
import { useRouter } from "vue-router";

export const First = defineComponent({
  setup() {
    const div = ref<HTMLDivElement>();
    const router = useRouter();
    const { swiping, direction } = useSwipe(div, {
      beforeStart: (e) => e.preventDefault(),
    });
    watchEffect(() => {
      if (swiping.value && direction.value === "left") {
        router.push("/welcome/2");
      }
    });

    return () => (
      <div class={s.card} ref={div}>
        <div class={s.title1}>开源节流</div>
        <div class={s.content}>&nbsp;&nbsp;既会挣钱，也懂省钱。</div>
      </div>
    );
  },
});
