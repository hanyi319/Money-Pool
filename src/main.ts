import { createApp } from "vue";
import { App } from "./App";
import { createRouter } from "vue-router";
import { routes } from "./config/routes";
import { history } from "./shared/history";
import "@svgstore";
import { createPinia } from "pinia";
import { useMeStore } from "./stores/useMeStore";

const router = createRouter({
  history,
  routes,
});

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");

// 注意需要在配置 Pinia 之后，再使用
const meStore = useMeStore();
meStore.fetchMe();

router.beforeEach(async (to, from) => {
  if (
    to.path === "/" ||
    to.path === "/items" ||
    to.path.startsWith("/welcome") ||
    to.path.startsWith("/sign_in")
  ) {
    return true;
  } else {
    const path = await meStore.mePromise!.then(
      () => true,
      () => "/sign_in?return_to=" + to.path
    );
    return path;
  }
});
