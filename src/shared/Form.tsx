import { computed, defineComponent, PropType, ref } from "vue";
import { EmojiSelect } from "./EmojiSelect";
import { DatetimePicker, Popup } from "vant";
import { Time } from "./time";
import { Button } from "./Button";
import s from "./Form.module.scss";

export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    );
  },
});

export const FormItem = defineComponent({
  props: {
    label: { type: String },
    modelValue: { type: [String, Number] },
    type: {
      type: String as PropType<"text" | "emojiSelect" | "date" | "validationCode" | "select">,
    },
    placeholder: String,
    error: {
      type: String,
    },
    options: Array as PropType<Array<{ value: string; text: string }>>,
    onClick: Function as PropType<() => void>,
  },
  emits: ["update:modelValue"],
  setup: (props, context) => {
    const refDateVisible = ref(false);
    const content = computed(() => {
      switch (props.type) {
        case "text":
          return (
            <input
              value={props.modelValue}
              placeholder={props.placeholder}
              onInput={(e: any) => context.emit("update:modelValue", e.target.value)}
              class={[s.formItem, s.input, props.error === undefined ? "" : s.error]}
            />
          );
        case "emojiSelect":
          return (
            <EmojiSelect
              modelValue={props.modelValue?.toString()}
              onUpdateModelValue={(value) => context.emit("update:modelValue", value)}
              class={[s.formItem, s.emojiList, props.error === undefined ? "" : s.error]}
            />
          );
        case "date":
          return (
            <>
              <input
                readonly={true}
                value={props.modelValue}
                onClick={() => {
                  refDateVisible.value = true;
                }}
                placeholder={props.placeholder}
                class={[s.formItem, s.input, s.normal]}
              />
              <Popup position="bottom" v-model:show={refDateVisible.value}>
                <DatetimePicker
                  value={props.modelValue}
                  type="date"
                  title="选择日期"
                  onConfirm={(date: Date) => {
                    context.emit("update:modelValue", new Time(date).format());
                    refDateVisible.value = false;
                  }}
                  onCancel={() => (refDateVisible.value = false)}
                />
              </Popup>
            </>
          );
        case "validationCode":
          return (
            <>
              <input
                class={[
                  s.formItem,
                  s.input,
                  props.error === undefined ? "" : s.error,
                  s.validationCodeInput,
                ]}
                placeholder={props.placeholder}
              />
              <Button
                class={[
                  s.formItem,
                  s.button,
                  props.error === undefined ? "" : s.error,
                  s.validationCodeButton,
                ]}
                onClick={props.onClick}
              >
                发送验证码
              </Button>
            </>
          );
        case "select":
          return (
            <select
              class={[
                s.formItem,
                s.select,
                props.modelValue === "expenditure" ? s.expenditure : s.income,
              ]}
              value={props.modelValue}
              onChange={(e: any) => {
                context.emit("update:modelValue", e.target.value);
              }}
            >
              {props.options?.map((option) => (
                <option value={option.value}>{option.text}</option>
              ))}
            </select>
          );
        case undefined:
          return context.slots.default?.();
      }
    });
    return () => {
      return (
        <div class={s.formRow}>
          <label class={s.formLabel}>
            {props.label && <span class={s.formItem_name}>{props.label}</span>}
            <div class={s.formItem_value}>{content.value}</div>
            <div class={s.formItem_errorHint}>
              <span>{props.error ?? "　"}</span>
            </div>
          </label>
        </div>
      );
    };
  },
});
