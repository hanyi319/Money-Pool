import { defineComponent, PropType } from "vue";

// 补零
const addZero = (n: number) => {
  const nString = n.toString();
  const dotIndex = nString.indexOf(".");
  if (dotIndex < 0) {
    // 如果没有小数点
    return nString + ".00";
  } else if (nString.substring(dotIndex).length === 2) {
    // 如果小数点后只有一位数字
    return nString + "0";
  } else {
    // 如果小数点后有两位数字
    return nString;
  }
};

// 优化金额显示
export const Money = defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup: (props, context) => {
    /**
     * 因为已经限制了金额只支持小数点后两位，所以也可以使用 toFixed(2)
     * (props.value / 100).toFixed(2)
     */
    return () => <span>{addZero(props.value / 100)}</span>;
  },
});

export const getMoney = (n: number) => {
  return addZero(n / 100);
};
