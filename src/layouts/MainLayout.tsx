import { defineComponent, PropType } from "vue";
import { TopNav } from "../shared/TopNav";
import s from "./MainLayout.module.scss";

export const MainLayout = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <TopNav class={s.navbar}>
          {{
            default: () => context.slots.title?.(),
            icon: () => context.slots.icon?.(),
          }}
        </TopNav>
        {context.slots.default?.()}
      </div>
    );
  },
});
