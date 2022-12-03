import { defineComponent, PropType, reactive } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Tabs, Tab } from "../../shared/Tabs";
import { Tags } from "./Tags";
import { InputPad } from "./InputPad";
import { useRouter } from "vue-router";
import { AxiosError } from "axios";
import { Dialog } from "vant";
import { http } from "../../shared/Http";
import { BackIcon } from "../../shared/BackIcon";
import s from "./ItemCreate.module.scss";

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const formData = reactive({
      kind: "支出", // 交易类别，默认为「支出」
      tags_id: [], // 交易标签，不设置默认值
      amount: 0, // 交易时间，默认为当前时间，并且需要做 ISO 8601 格式化
      happen_at: new Date().toISOString(), // 交易金额，默认为0
    });
    const router = useRouter();
    const onError = (error: AxiosError<ResourceError>) => {
      if (error.response?.status === 422) {
        Dialog.alert({
          title: "出错",
          message: Object.values(error.response.data.errors).join("\n"),
        });
      }
      throw error;
    };
    const onSubmit = async () => {
      await http.post<Resource<Item>>("/items", formData, { _mock: "itemCreate" }).catch(onError);
      router.push("/items");
    };
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => "记账",
          icon: () => <BackIcon />,
          default: () => (
            <>
              <div class={s.wrapper}>
                <Tabs v-model:selected={formData.kind} class={s.tabs}>
                  <Tab name="支出">
                    <Tags kind="expenses" v-model:selected={formData.tags_id[0]} />
                  </Tab>
                  <Tab name="收入">
                    <Tags kind="income" v-model:selected={formData.tags_id[0]} />
                  </Tab>
                </Tabs>
                <div class={s.inputPad_wrapper}>
                  <InputPad
                    v-model:happenAt={formData.happen_at}
                    v-model:amount={formData.amount}
                    onSubmit={onSubmit}
                  />
                </div>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
