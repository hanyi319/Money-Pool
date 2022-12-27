import { defineComponent } from "vue";
import { TimeTabsLayout } from "../layouts/TimeTabsLayout";
import { ItemSummary } from "../components/item/ItemSummary";

export const ItemListPage = defineComponent({
  setup: (props, context) => {
    return () => <TimeTabsLayout component={ItemSummary} />;
  },
});

export default ItemListPage;
