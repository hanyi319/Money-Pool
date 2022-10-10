import { defineComponent } from "vue";
import s from "./WelcomeLayout.module.scss";
import { RouterLink } from "vue-router";
import { WelcomeLayout } from "./WelcomeLayout";

export const Third = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeLayout>
        {{
          title: () => <div class={s.title3}>一目了然</div>,
          content: () => <div class={s.content}>&nbsp;&nbsp;重要信息，有效呈现。</div>,
          buttons: () => (
            <>
              <RouterLink to="/welcome/2">上一页</RouterLink>
              <RouterLink to="/welcome/4">下一页</RouterLink>
              <RouterLink to="/start">&nbsp;&nbsp;跳过</RouterLink>
            </>
          ),
        }}
      </WelcomeLayout>
    );
  },
});
