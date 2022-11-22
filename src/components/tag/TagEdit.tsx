import { defineComponent, reactive } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { BackIcon } from "../../shared/BackIcon";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Icon } from "../../shared/Icon";
import { Rules, validate } from "../../shared/validate";
import s from "./Tag.module.scss";
import { TagFrom } from "./TagForm";

// 编辑标签页面
export const TagEdit = defineComponent({
  setup: (props, context) => {
    // 表单数据
    const formData = reactive({
      name: "",
      sign: "",
    });

    // 错误信息（其中 key 必须属于表单数据的 key）
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({});

    const onSubmit = (e: Event) => {
      // 校验规则
      const rules: Rules<typeof formData> = [
        { key: "name", type: "required", message: "未填写名称" },
        {
          key: "name",
          type: "pattern",
          regex: /^.{1,4}$/,
          message: "名称不能超过 4 个字符",
        },
        {
          key: "sign",
          type: "required",
          message: "未选择图标",
        },
      ];

      // 由于 errors 不能直接赋值，所以通过 Object.assign 进行覆盖
      // 先清空错误信息，这样正确提交时就不会再显示之前的报错
      Object.assign(errors, {
        name: undefined,
        sign: undefined,
      });
      Object.assign(errors, validate(formData, rules));

      // 阻止默认刷新页面事件
      e.preventDefault();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "编辑标签",
          icon: () => <BackIcon />,
          default: () => (
            <>
              <TagFrom />
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
