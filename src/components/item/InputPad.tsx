import { defineComponent, PropType, ref } from "vue";
import { Icon } from "../../shared/Icon";
import { Time } from "../../shared/time";
import { DatetimePicker, Popup } from "vant";
import s from "./InputPad.module.scss";

export const InputPad = defineComponent({
  props: {
    happenAt: String,
    amount: Number,
    onSubmit: {
      type: Function as PropType<() => void>,
    },
  },
  setup: (props, context) => {
    const refDatetimePickerVisible = ref(false);
    const showDatetimePicker = () => (refDatetimePickerVisible.value = true);
    const hideDatetimePicker = () => (refDatetimePickerVisible.value = false);
    const setDate = (date: Date) => {
      context.emit("update:happenAt", date.toISOString());
      hideDatetimePicker();
    };
    /**
     * 由于并不想随时存储用户当前输入金额（有可能还未输入完毕），而是只在提交时才记录
     * 所以还需要一个 refAmount 作为中间值暂存当前的输入
     * 但是外部传进来的 amount 是 number 类型，而 refAmount 却是 string 类型
     * 所以需要做类型转换
     * 比如外部传入 9910，除以 100 并转为字符串后得到 "99.1"，提交时再转为浮点数并乘以 100，得到 9910
     * 至于为什么要乘 100，是因为小数点后支持两位数，这样就避免了不转换成字符串，小数点后边的 0 会被 number “吃掉” 的问题
     * 由于限制了输入金额为 13 位（包括小数点），所以暂不用考虑 JS 的精度问题
     */
    const refAmount = ref(props.amount ? (props.amount / 100).toString() : "0"); // 如果外部没有传值，默认就为 0
    const appendText = (n: number | string) => {
      const nString = n.toString();
      const dotIndex = refAmount.value.indexOf(".");
      if (refAmount.value.length >= 13) {
        return;
      }
      if (dotIndex >= 0 && refAmount.value.length - dotIndex > 2) {
        return;
      }
      if (nString === ".") {
        // 输入小数点的情况：
        // 如果已经存在小数点，则直接返回
        if (dotIndex >= 0) {
          return;
        }
        // 输入 0 的情况：
      } else if (nString === "0") {
        // 如果此时输入金额就是 0，则直接返回
        if (refAmount.value === "0") {
          return;
        }
        // 输入 1-9 的情况：
      } else {
        // 清除默认占位的 0
        if (refAmount.value === "0") {
          refAmount.value = "";
        }
      }
      refAmount.value += n.toString();
    };
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
          refAmount.value = "0";
        },
      },
      {
        text: "确认",
        onClick: () => {
          context.emit("update:amount", parseFloat(refAmount.value) * 100);
          props.onSubmit?.();
        },
      },
    ];
    return () => (
      <>
        <div class={s.details}>
          <span class={s.date}>
            <Icon name="date" class={s.icon} />
            <span>
              <span onClick={showDatetimePicker}>{new Time(props.happenAt).format()}</span>
              <Popup position="bottom" v-model:show={refDatetimePickerVisible.value}>
                <DatetimePicker
                  modelValue={props.happenAt ? new Date(props.happenAt) : new Date()}
                  type="date"
                  title="选择日期"
                  onConfirm={setDate}
                  onCancel={hideDatetimePicker}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>￥{refAmount.value}</span>
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
