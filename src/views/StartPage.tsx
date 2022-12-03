import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import { MainLayout } from "../layouts/MainLayout";
import { OverlayIcon } from "../shared/Overlay";
import { Center } from "../shared/Center";
import { Icon } from "../shared/Icon";
import { Button } from "../shared/Button";
import { FloatButton } from "../shared/FloatButton";
import s from "./StartPage.module.scss";

export const StartPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>
        {{
          title: () => "点滴记账",
          icon: () => <OverlayIcon />,
          default: () => (
            <>
              <Center class={s.icon_wrapper}>
                <Icon name="note" class={s.icon} />
              </Center>
              <div class={s.button_wrapper}>
                <RouterLink to="/items/create">
                  <Button class={s.button}>开始记账</Button>
                </RouterLink>
              </div>
              <RouterLink to="/items/create">
                <FloatButton iconName="add" />
              </RouterLink>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
