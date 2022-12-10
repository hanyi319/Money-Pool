import { defineComponent, onMounted, PropType, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "./Icon";
import { Dialog } from "vant";
import { useMeStore } from "../stores/useMeStore";
import s from "./Overlay.module.scss";

// 侧边栏
export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>,
    },
  },
  setup: (props, context) => {
    const meStore = useMeStore();
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
      const response = await meStore.mePromise;
      me.value = response?.data.resource;
    });
    return () => (
      <>
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <div class={s.currentUserWrapper}>
            <section class={s.currentUser}>
              {me.value ? (
                <div>
                  <h2 class={s.email}>{me.value.email}</h2>
                  <p onClick={onSignOut} class={s.subtext}>
                    点击此处退出登录
                  </p>
                </div>
              ) : (
                <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
                  <h2>未登录用户</h2>
                  <p class={s.subtext}>点击此处登录</p>
                </RouterLink>
              )}
            </section>
          </div>
          <nav>
            <ul class={s.action_list}>
              <li onClick={close}>
                <RouterLink to="/items/create" class={s.action}>
                  <Icon name="note" class={s.icon} />
                  <span>记账面板</span>
                </RouterLink>
              </li>
              <li onClick={close}>
                <RouterLink to="/items" class={s.action}>
                  <Icon name="item" class={s.icon} />
                  <span>明细列表</span>
                </RouterLink>
              </li>
              <li onClick={close}>
                <RouterLink to="/statistics" class={s.action}>
                  <Icon name="chart" class={s.icon} />
                  <span>统计图表</span>
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
