import { defineComponent, reactive, PropType, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "../../shared/Button";
import { Form, FormItem } from "../../shared/Form";
import { http } from "../../shared/Http";
import { onFormError } from "../../shared/onFormError";
import { hasError, Rules, validate } from "../../shared/validate";
import s from "./Tag.module.scss";

export const TagFrom = defineComponent({
  props: {
    id: Number,
  },
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();

    // 表单数据
    const formData = reactive<Partial<Tag>>({
      id: undefined, // 标签 id，如果是新增标签就默认为空，如果是编辑标签，就需要外部传值
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
        const promise = (await formData.id)
          ? http.patch(`/tags/${formData.id}`, formData, {
              params: { _mock: "tagEdit" },
            })
          : http.post("/tags", formData, {
              params: { _mock: "tagCreate" },
            });
        await promise.catch((error) =>
          onFormError(error, (data) => Object.assign(errors, data.errors))
        );
        router.back();
      }
    };
    onMounted(async () => {
      // 如果外部传入的 id 为空，那就是创建标签，否则就是编辑标签
      if (!props.id) {
        return;
      }
      const response = await http.get<Resource<Tag>>(`/tags/${props.id}`, {
        _mock: "tagShow",
      });
      Object.assign(formData, response.data.resource);
    });
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
