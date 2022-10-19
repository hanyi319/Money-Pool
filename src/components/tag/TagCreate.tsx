import { defineComponent, ErrorCodes, PropType, reactive, toRaw } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { EmojiSelect } from "../../shared/EmojiSelect";
import { Icon } from "../../shared/Icon";
import s from "./TagCreate.module.scss";

export const TagCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const formData = reactive({
      name: "",
      sign: "",
    });
    const onSubmit = (e: Event) => {
      console.log(toRaw(formData));
      // const rules = [
      //   { key: "name", required: "true", message: "必填" },
      //   { key: "name", pattern: /^.{1, 4}$/, message: "标签名长度为 1 ~ 4 个字符" },
      //   {
      //     key: "sign",
      //     required: "true",
      //     message: "必选",
      //   },
      // ];
      // const errors = validate(formData, rules);
      // errors = {
      //   name: ["错误1", "错误2"],
      //   sign: ["错误3", "错误4"],
      // };
      e.preventDefault();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "新建标签",
          icon: () => <Icon name="back" onClick={() => {}} />,
          default: () => (
            <form class={s.form} onSubmit={onSubmit}>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>标签名</span>
                  <div class={s.formItem_value}>
                    <input v-model={formData.name} class={[s.formItem, s.input, s.error]}></input>
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>必填</span>
                    {/* <span>{errors["name"].join("，")}</span> */}
                  </div>
                </label>
              </div>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>图标 {formData.sign}</span>
                  <div class={s.formItem_value}>
                    <EmojiSelect
                      v-model={formData.sign}
                      class={[s.formItem, s.emojiList, s.error]}
                    />
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>必选</span>
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
          ),
        }}
      </MainLayout>
    );
  },
});
