import { defineComponent, PropType } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "./Icon";
import s from "./BottomNav.module.scss";

export const BottomNav = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    return () => (
      <nav class={s.bottomNav}>
        <RouterLink to="/notes" class={s.item} active-class={s.selected}>
          <Icon name="note" class={s.icon} />
          记账
        </RouterLink>
        <RouterLink to="/items" class={s.item} active-class={s.selected}>
          <Icon name="item" class={s.icon} />
          明细
        </RouterLink>
        <RouterLink to="/statistics" class={s.item} active-class={s.selected}>
          <Icon name="chart" class={s.icon} />
          统计
        </RouterLink>
      </nav>
    );
  },
});
