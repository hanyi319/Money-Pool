import { defineComponent, ref } from "vue";
import { Button } from "../shared/Button";
import { Center } from "../shared/Center";
import { FloatButton } from "../shared/FloatButton";
import { Icon } from "../shared/Icon";
import { Navbar } from "../shared/Navbar";
import { Overlay } from "../shared/Overlay";
import s from "./StartPage.module.scss";

export const StartPage = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref(false);
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value;
    };

    return () => (
      <div>
        <Navbar>
          {{
            default: () => "清流记账",
            icon: () => <Icon name="menu" class={s.navIcon} onClick={onClickMenu} />,
          }}
        </Navbar>
        <Center class={s.note_wrapper}>
          <Icon name="note" class={s.note} />
        </Center>
        <div class={s.button_wrapper}>
          <Button class={s.button}>开始记账</Button>
        </div>
        <FloatButton iconName="add" />
        {refOverlayVisible.value && <Overlay onClose={() => (refOverlayVisible.value = false)} />}
      </div>
    );
  },
});
