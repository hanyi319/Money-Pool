import { RouteRecordRaw } from "vue-router";
import { Welcome } from "../views/Welcome";
import { First } from "../components/welcome/First";
import { FirstActions } from "../components/welcome/FirstActions";
import { Second } from "../components/welcome/Second";
import { SecondActions } from "../components/welcome/SecondActions";
import { Third } from "../components/welcome/Third";
import { ThirdActions } from "../components/welcome/ThirdActions";
import { Fourth } from "../components/welcome/Fourth";
import { FourthActions } from "../components/welcome/FourthActions";
import { SignInPage } from "../views/SignInPage";
import { ItemList } from "../components/item/ItemList";
import { ItemCreate } from "../components/item/ItemCreate";
import { TagPage } from "../views/TagPage";
import { TagCreate } from "../components/tag/TagCreate";
import { TagEdit } from "../components/tag/TagEdit";
import { StatisticsPage } from "../views/StatisticsPage";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/welcome" },
  {
    path: "/welcome",
    component: Welcome,
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
  { path: "/sign_in", component: SignInPage },
  { path: "/notes", component: ItemCreate },
  { path: "/items", component: ItemList },
  {
    path: "/tags",
    component: TagPage,
    children: [
      { path: "create", component: TagCreate },
      { path: ":id/edit", component: TagEdit },
    ],
  },
  {
    path: "/statistics",
    component: StatisticsPage,
  },
];
