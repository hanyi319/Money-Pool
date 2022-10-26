import { defineComponent, reactive, PropType } from "vue";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Form, FormItem } from "../../shared/Form";
import { Rules, validate } from "../../shared/validate";
import s from "./Tag.module.scss";

export const TagFrom = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
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
          <Button class={s.button}>确定</Button>
        </FormItem>
      </Form>
    );
  },
});
