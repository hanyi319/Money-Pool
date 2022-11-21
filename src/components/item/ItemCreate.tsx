import { defineComponent, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
import { Tags } from "./Tags";
import { InputPad } from "./InputPad";
import s from "./ItemCreate.module.scss";

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refKind = ref("支出"); // 交易类别，默认为「支出」
    const refTagId = ref<number>(); // 交易标签，不设置默认值
    const refHappenAt = ref<string>(new Date().toISOString()); // 交易时间，默认为当前时间，并且需要做 ISO 8601 格式化
    const refAmount = ref<number>(0); // 交易金额，默认为0
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => "记账",
          icon: () => <Icon name="back" class={s.navIcon} />,
          default: () => (
            <>
              <div class={s.wrapper}>
                <Tabs v-model:selected={refKind.value} class={s.tabs}>
                  <Tab name="支出">
                    <Tags kind="expenses" v-model:selected={refTagId.value} />
                  </Tab>
                  <Tab name="收入">
                    <Tags kind="income" v-model:selected={refTagId.value} />
                  </Tab>
                </Tabs>
                <div>{refAmount.value}</div>
                <div class={s.inputPad_wrapper}>
                  <InputPad v-model:happenAt={refHappenAt.value} v-model:amount={refAmount.value} />
                </div>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
