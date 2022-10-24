import { computed, defineComponent, PropType, ref } from "vue";
import { EmojiSelect } from "./EmojiSelect";
import { emojiList } from "./emojiList";
import { DatetimePicker, Popup } from "vant";
import { Time } from "./time";
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
      type: String as PropType<"text" | "emojiSelect" | "date">,
    },
    error: {
      type: String,
    },
  },
  setup: (props, context) => {
    const refDateVisible = ref(false);
    const content = computed(() => {
      switch (props.type) {
        case "text":
          return (
            <input
              value={props.modelValue}
              onInput={(e: any) => context.emit("update:modelValue", e.target.value)}
              class={[s.formItem, s.input, props.error === "　" ? s.normal : s.error]}
            />
          );
        case "emojiSelect":
          return (
            <EmojiSelect
              modelValue={props.modelValue?.toString()}
              onUpdateModelValue={(value) => context.emit("update:modelValue", value)}
              class={[s.formItem, s.emojiList, props.error === "　" ? s.normal : s.error]}
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
            {props.error && (
              <div class={s.formItem_errorHint}>
                <span>{props.error}</span>
              </div>
            )}
          </label>
        </div>
      );
    };
  },
});
