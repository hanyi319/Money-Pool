import { RouteRecordRaw } from "vue-router";
import { First } from "../components/welcome/First";
import { FirstActions } from "../components/welcome/FirstActions";
import { Second } from "../components/welcome/Second";
import { SecondActions } from "../components/welcome/SecondActions";
import { Third } from "../components/welcome/Third";
import { ThirdActions } from "../components/welcome/ThirdActions";
import { Fourth } from "../components/welcome/Fourth";
import { FourthActions } from "../components/welcome/FourthActions";
import { TagCreate } from "../components/tag/TagCreate";
import { TagEdit } from "../components/tag/TagEdit";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/welcome" },
  {
    path: "/welcome",
    component: () => import("../views/Welcome"),
    beforeEnter: (to, from, next) => {
      localStorage.getItem("skipFeatures") === "yes" ? next("/items") : next();
    },
    children: [
      { path: "", redirect: "/welcome/1" },
      { path: "1", name: "Welcome1", components: { main: First, footer: FirstActions } },
      { path: "2", name: "Welcome2", components: { main: Second, footer: SecondActions } },
      { path: "3", name: "Welcome3", components: { main: Third, footer: ThirdActions } },
      { path: "4", name: "Welcome4", components: { main: Fourth, footer: FourthActions } },
    ],
  },
  { path: "/sign_in", component: () => import("../views/SignInPage") },
  { path: "/notes", component: () => import("../views/ItemCreatePage") },
  { path: "/items", component: () => import("../views/ItemListPage") },
  {
    path: "/tags",
    component: () => import("../views/TagPage"),
    children: [
      { path: "create", component: TagCreate },
      { path: ":id/edit", component: TagEdit },
    ],
  },
  {
    path: "/statistics",
    component: () => import("../views/StatisticsPage"),
  },
  {
    path: "/comingsoon",
    component: () => import("../shared/ComingSoon"),
  },
];
