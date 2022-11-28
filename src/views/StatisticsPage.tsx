import { defineComponent } from "vue";
import { TimeTabsLayout } from "../layouts/TimeTabsLayout";
import { Chart } from "../components/statistics/Chart";

export const StatisticsPage = defineComponent({
  setup: (props, context) => {
    return () => <TimeTabsLayout component={Chart} reRenderOnSwitchTab={true} />;
  },
});
