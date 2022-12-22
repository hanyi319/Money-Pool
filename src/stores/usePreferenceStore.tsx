import { defineStore } from "pinia";

type State = {
  kind: "expenses" | "income";
};
type Actions = {
  updateKind: () => void;
};

export const usePreferenceStore = defineStore<string, State, {}, Actions>("preference", {
  state: () => ({
    kind: "expenses",
  }),
  actions: {
    updateKind() {
      this.kind === "expenses" ? (this.kind = "income") : (this.kind = "income");
    },
  },
});
