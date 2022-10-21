import { defineComponent, reactive, PropType } from "vue";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
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
      <form class={s.form} onSubmit={onSubmit}>
        <div class={s.formRow}>
          <label class={s.formLabel}>
            <span class={s.formItem_name}>名称：</span>
            <div class={s.formItem_value}>
              <input
                v-model={formData.name}
                class={[s.formItem, s.input, errors["name"] ? s.error : s.normal]}
              ></input>
            </div>
            <div class={s.formItem_errorHint}>
              <span>{errors["name"] ? errors["name"][0] : "　"}</span>
            </div>
          </label>
        </div>
        <div class={s.formRow}>
          <label class={s.formLabel}>
            <span class={s.formItem_name}>图标：{formData.sign}</span>
            <div class={[s.formItem_value, errors["sign"] ? s.error : s.normal]}>
              <EmojiSelect v-model={formData.sign} />
            </div>
            <div class={s.formItem_errorHint}>
              <span>{errors["sign"] ? errors["sign"][0] : "　"}</span>
            </div>
          </label>
        </div>
        <p class={s.tips}>长按标签，即可编辑</p>
        <div class={s.formRow}>
          <div class={s.formItem_value}>
            <Button class={[s.formItem, s.button]}>确定</Button>
          </div>
        </div>
      </form>
    );
  },
});
