import { defineComponent, onMounted, PropType, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "./Icon";
import s from "./Overlay.module.scss";
import { mePromise } from "./me";
import { Dialog } from "vant";

// 侧边栏
export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>,
    },
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.();
    };
    // 登录和退出登录
    const route = useRoute();
    const me = ref<User>();
    const onSignOut = async () => {
      await Dialog.confirm({
        title: "确认",
        message: "是否退出登录？",
      });
      localStorage.removeItem("jwt");
    };
    onMounted(async () => {
      const response = await mePromise;
      me.value = response?.data.resource;
    });
    return () => (
      <>
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <section class={s.currentUser}>
            {me.value ? (
              <div>
                <h2 class={s.email}>{me.value.email}</h2>
                <p onClick={onSignOut}>点击此处退出登录</p>
              </div>
            ) : (
              <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
                <h2>未登录用户</h2>
                <p>点击此处登录</p>
              </RouterLink>
            )}
          </section>
          <nav>
            <ul class={s.action_list}>
              <li>
                <RouterLink to="/statistics" class={s.action}>
                  <Icon name="chart" class={s.icon} />
                  <span>统计图表</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/export" class={s.action}>
                  <Icon name="cloud" class={s.icon} />
                  <span>数据导出</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/notify" class={s.action}>
                  <Icon name="clock" class={s.icon} />
                  <span>记账提醒</span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  },
});

// 侧边栏图标
export const OverlayIcon = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref(false);
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value;
    };
    return () => (
      <>
        <Icon name="menu" class={s.icon} onClick={onClickMenu} />
        {refOverlayVisible.value && <Overlay onClose={() => (refOverlayVisible.value = false)} />}
      </>
    );
  },
});
