import { defineComponent, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemCreate.module.scss";

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refKind = ref("支出");

    return () => (
      <MainLayout>
        {{
          title: () => "记一笔",
          icon: () => <Icon name="back" class={s.navIcon} />,
          default: () => (
            <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={(name) => (refKind.value = name)}> */}
              <Tabs v-model:selected={refKind.value}>
                <Tab name="支出">icon 列表 1</Tab>
                <Tab name="收入">icon 列表 2</Tab>
              </Tabs>
              <div class={s.inputPad_wrapper}>
                <InputPad />
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
