import { defineComponent, PropType, ref } from "vue";
import { Icon } from "../../shared/Icon";
import { time } from "../../shared/time";
import { DatetimePicker, Popup } from "vant";
import s from "./InputPad.module.scss";

export const InputPad = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refDate = ref<Date>(new Date());
    const refShowPop = ref(false);
    const buttons = [
      { text: "1", onClick: () => {} },
      { text: "2", onClick: () => {} },
      { text: "3", onClick: () => {} },
      { text: "C", onClick: () => {} },
      { text: "4", onClick: () => {} },
      { text: "5", onClick: () => {} },
      { text: "6", onClick: () => {} },
      { text: "+", onClick: () => {} },
      { text: "7", onClick: () => {} },
      { text: "8", onClick: () => {} },
      { text: "9", onClick: () => {} },
      { text: "-", onClick: () => {} },
      { text: ".", onClick: () => {} },
      { text: "0", onClick: () => {} },
      { text: "AC", onClick: () => {} },
      { text: "OK", onClick: () => {} },
    ];

    return () => (
      <>
        <div class={s.details}>
          <span class={s.date}>
            <Icon name="date" class={s.icon} />
            <span>
              <span onClick={() => (refShowPop.value = true)}>{time(refDate.value).format()}</span>
              <Popup position="bottom" v-model:show={refShowPop.value}>
                <DatetimePicker
                  v-model={refDate.value}
                  type="date"
                  title="选择年月日"
                  onConfirm={() => (refShowPop.value = false)}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>1234567890.123</span>
        </div>
        <div class={s.buttons}>
          {buttons.map((button) => (
            <button onClick={button.onClick}>{button.text}</button>
          ))}
        </div>
      </>
    );
  },
});
