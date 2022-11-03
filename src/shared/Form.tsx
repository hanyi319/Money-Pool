import { computed, defineComponent, PropType, ref } from "vue";
import { EmojiSelect } from "./EmojiSelect";
import { DatetimePicker, Popup } from "vant";
import { Time } from "./time";
import { Button } from "./Button";
import s from "./Form.module.scss";
import { getFriendlyError } from "./getFriendlyError";

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
    countFrom: {
      type: Number,
      default: 60,
    },
  },
  emits: ["update:modelValue"],
  setup: (props, context) => {
    const refDateVisible = ref(false);

    // 发送验证码后禁用按钮，并显示 60 秒倒计时
    const timer = ref<number>(); // timer 是一个定时器
    const count = ref<number>(props.countFrom); // 默认等待 60 秒
    const isCounting = computed(() => !!timer.value); // 根据是否设置了定时器计算出是否处于倒计时状态
    const startCount = () => {
      timer.value = setInterval(() => {
        count.value -= 1;
        if (count.value === 0) {
          clearInterval(timer.value); // 需要注意移除定时器，否则会影响到倒计时状态的判断
          timer.value = undefined;
          count.value = props.countFrom;
        }
      }, 1000);
    };
    /**
     * 通过 context.expose() 暴露给父组件进行调用，父组件再通过 ref 引用
     * 实际的写法是 context.expose({ startCount: startCount })
     * 前面的 startCount 是 key，后面的 startCount 是 value，也就是函数名
     */
    context.expose({ startCount });

    // 根据表单类型展示不同内容
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
                disabled={isCounting.value}
                onClick={props.onClick}
                class={[
                  s.formItem,
                  s.button,
                  props.error === undefined ? "" : s.error,
                  s.validationCodeButton,
                ]}
              >
                {isCounting.value ? `${count.value}秒后可重新发送` : "发送验证码"}
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
              <span>{props.error ? getFriendlyError(props.error) : "　"}</span>
            </div>
          </label>
        </div>
      );
    };
  },
});
