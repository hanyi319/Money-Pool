import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export const SkipFeatures = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      localStorage.setItem("skipFeatures", "yes");
    };
    return () => (
      <span onClick={onClick}>
        <RouterLink to="/items">&nbsp;&nbsp;跳过</RouterLink>
      </span>
    );
  },
});
