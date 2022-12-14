import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { http } from "../../shared/Http";
import { MainLayout } from "../../layouts/MainLayout";
import { BackIcon } from "../../shared/BackIcon";
import { TagFrom } from "./TagForm";
import { Button } from "../../shared/Button";
import { Dialog } from "vant";
import s from "./Tag.module.scss";

// 编辑标签页面
export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();
    // 因为从 url 获取到的 id 是 string 类型，所以还需要做类型转换
    const numberId = parseInt(route.params.id!.toString());
    const onError = () => {
      Dialog.alert({ title: "提示", message: "删除失败" });
    };
    const onDelete = async (options?: { withItems?: boolean }) => {
      await Dialog.confirm({
        title: "确认",
        message: "你真的要删除吗？",
      });
      await http
        .delete(
          `/tags/${numberId}`,
          {
            with_items: options?.withItems ? "true" : "false",
          },
          { _autoLoading: true }
        )
        .catch(onError);
      router.back();
    };
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
              <Button
                level="danger"
                class={s.removeTagsAndItems}
                onClick={() => onDelete({ withItems: true })}
              >
                删除标签和对应记账数据
              </Button>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
