import { defineComponent, reactive, PropType } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "../../shared/Button";
import { Form, FormItem } from "../../shared/Form";
import { http } from "../../shared/Http";
import { onFormError } from "../../shared/onFormError";
import { hasError, Rules, validate } from "../../shared/validate";
import s from "./Tag.module.scss";

export const TagFrom = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();

    // 表单数据
    const formData = reactive({
      name: "", // 标签名
      sign: "", // 符号
      kind: route.query.kind!.toString(), // 使用隐藏字段来标记当前新增标签类别（支出 / 收入）
    });

    // 错误信息（其中 key 必须属于表单数据的 key）
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({});

    // 新增标签
    const onSubmit = async (e: Event) => {
      e.preventDefault(); // 阻止默认刷新页面事件

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

      /**
       * 由于 errors 不能直接赋值，所以通过 Object.assign 进行覆盖
       * 先清空错误信息，这样正确提交时就不会再显示之前的报错
       */
      Object.assign(errors, {
        name: [],
        sign: [],
      });
      Object.assign(errors, validate(formData, rules));
      if (!hasError(errors)) {
        const response = await http
          .post("/tags", formData, {
            params: { _mock: "tagCreate" },
          })
          .catch((error) => onFormError(error, (data) => Object.assign(errors, data.errors)));
        router.back();
      }
    };
    return () => (
      <Form onSubmit={onSubmit}>
        <FormItem label="标签名" type="text" v-model={formData.name} error={errors["name"]?.[0]} />
        <FormItem
          label={"符号 " + formData.sign}
          type="emojiSelect"
          v-model={formData.sign}
          error={errors["sign"]?.[0]}
        />
        <FormItem>
          <p class={s.tips}>长按标签，即可编辑</p>
        </FormItem>
        <FormItem>
          <Button type="submit" class={s.button}>
            确定
          </Button>
        </FormItem>
      </Form>
    );
  },
});
