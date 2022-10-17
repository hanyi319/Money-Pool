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
    const refDatetimePickerVisible = ref(false);
    const showDatetimePicker = () => (refDatetimePickerVisible.value = true);
    const hideDatetimePicker = () => (refDatetimePickerVisible.value = false);
    const setDate = (date: Date) => {
      refDate.value = date;
      hideDatetimePicker();
    };
    const refAmount = ref("");
    const appendText = (n: number | string) => (refAmount.value += n.toString());
    const buttons = [
      {
        text: "1",
        onClick: () => {
          appendText(1);
        },
      },
      {
        text: "2",
        onClick: () => {
          appendText(2);
        },
      },
      {
        text: "3",
        onClick: () => {
          appendText(3);
        },
      },

      {
        text: "4",
        onClick: () => {
          appendText(4);
        },
      },
      {
        text: "5",
        onClick: () => {
          appendText(5);
        },
      },
      {
        text: "6",
        onClick: () => {
          appendText(6);
        },
      },
      {
        text: "7",
        onClick: () => {
          appendText(7);
        },
      },
      {
        text: "8",
        onClick: () => {
          appendText(8);
        },
      },
      {
        text: "9",
        onClick: () => {
          appendText(9);
        },
      },
      {
        text: "0",
        onClick: () => {
          appendText(0);
        },
      },
      {
        text: ".",
        onClick: () => {
          appendText(".");
        },
      },
      {
        text: "清除",
        onClick: () => {
          refAmount.value = "";
        },
      },
      { text: "确认", onClick: () => {} },
    ];

    return () => (
      <>
        <div class={s.details}>
          <span class={s.date}>
            <Icon name="date" class={s.icon} />
            <span>
              <span onClick={showDatetimePicker}>{time(refDate.value).format()}</span>
              <Popup position="bottom" v-model:show={refDatetimePickerVisible.value}>
                <DatetimePicker
                  value={refDate.value}
                  type="date"
                  title="选择年月日"
                  onConfirm={setDate}
                  onCancel={hideDatetimePicker}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>{refAmount.value}</span>
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
