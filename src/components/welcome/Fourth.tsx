import s from "./WelcomeLayout.module.scss";
import { RouterLink } from "vue-router";
import { WelcomeLayout } from "./WelcomeLayout";

export const Fourth = () => {
  return (
    <WelcomeLayout>
      {{
        title: () => <div class={s.title4}>有备无患</div>,
        content: () => <div class={s.content}>&nbsp;&nbsp;数据上云，安全存储。</div>,
        buttons: () => (
          <>
            <RouterLink to="/welcome/3">上一页</RouterLink>
            <RouterLink to="/start">完成</RouterLink>
            <RouterLink class={s.fake} to="/start">
              下一页
            </RouterLink>
          </>
        ),
      }}
    </WelcomeLayout>
  );
};

Fourth.displayName = "Fourth";
