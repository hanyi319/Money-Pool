import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export const SkipFeatures = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      localStorage.setItem("skipFeatures", "yes");
    };
    return () => (
      <span onClick={onClick}>
        <RouterLink to="/items">跳过&nbsp;&nbsp;</RouterLink>
      </span>
    );
  },
});
