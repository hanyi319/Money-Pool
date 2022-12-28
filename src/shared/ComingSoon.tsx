import { defineComponent, PropType } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Button } from "./Button";
import { Center } from "./Center";
import { Icon } from "./Icon";
import s from "./ComingSoon.module.scss";

export const ComingSoon = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const router = useRouter();
    const onClick = () => {
      router.back();
    };
    return () => (
      <>
        <Center class={s.icon_wrapper} direction="|">
          <Icon name="logo" class={s.icon} />
          <span class={s.text}>敬请期待</span>
        </Center>
        <div class={s.button_wrapper}>
          <RouterLink to="/notes">
            <Button class={s.button}>返回</Button>
          </RouterLink>
        </div>
      </>
    );
  },
});

export default ComingSoon;
