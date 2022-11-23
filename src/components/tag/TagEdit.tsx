import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { MainLayout } from "../../layouts/MainLayout";
import { BackIcon } from "../../shared/BackIcon";
import { TagFrom } from "./TagForm";
import { Button } from "../../shared/Button";
import s from "./Tag.module.scss";

// 编辑标签页面
export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute();

    // 因为从 url 获取到的 id 是 string 类型，所以还需要做类型转换
    const numberId = parseInt(route.params.id!.toString());
    if (Number.isNaN(numberId)) {
      return () => <div>ID 不存在</div>;
    }
    return () => (
      <MainLayout>
        {{
          title: () => "编辑标签",
          icon: () => <BackIcon />,
          default: () => (
            <>
              <TagFrom id={numberId} />
              <div class={s.actions}>
                <Button level="important" class={s.removeTags} onClick={() => {}}>
                  删除标签
                </Button>
                <Button level="danger" class={s.removeTagsAndItems} onClick={() => {}}>
                  删除标签和记账
                </Button>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
