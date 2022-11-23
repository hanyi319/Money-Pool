import { defineComponent } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { BackIcon } from "../../shared/BackIcon";
import { TagFrom } from "./TagForm";

// 新增标签页面
export const TagCreate = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>
        {{
          title: () => "新增标签",
          icon: () => <BackIcon />,
          default: () => <TagFrom />,
        }}
      </MainLayout>
    );
  },
});
