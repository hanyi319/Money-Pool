import { defineComponent, PropType, reactive } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Tabs, Tab } from "../../shared/Tabs";
import { Tags } from "./Tags";
import { InputPad } from "./InputPad";
import { useRouter } from "vue-router";
import { AxiosError } from "axios";
import { Dialog } from "vant";
import { http } from "../../shared/Http";
import { OverlayIcon } from "../../shared/Overlay";
import { hasError, validate } from "../../shared/validate";
import s from "./ItemCreate.module.scss";

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const router = useRouter();
    const formData = reactive<Partial<Item>>({
      kind: "expenses", // 交易类别，默认为「支出」
      tag_ids: [], // 交易标签，不设置默认值
      amount: 0, // 交易时间，默认为当前时间，并且需要做 ISO 8601 格式化
      happen_at: new Date().toISOString(), // 交易金额，默认为0
    });
    const errors = reactive<FormErrors<typeof formData>>({
      kind: [],
      tag_ids: [],
      amount: [],
      happen_at: [],
    });
    const onError = (error: AxiosError<ResourceError>) => {
      if (error.response?.status === 422) {
        if (error.response.data.errors.tag_ids.indexOf("必填") >= 0) {
          error.response.data.errors.tag_ids[error.response.data.errors.tag_ids.indexOf("必填")] =
            "未选择标签";
        }
        Dialog.alert({
          title: "出错",
          message: Object.values(error.response.data.errors).join("\n"),
        });
      }
      throw error;
    };
    const onSubmit = async () => {
      Object.assign(errors, { kind: [], tag_ids: [], amount: [], happen_at: [] });
      Object.assign(
        errors,
        validate(formData, [
          { key: "kind", type: "required", message: "必须选择交易类别" },
          { key: "tag_ids", type: "required", message: "必须选择标签" },
          { key: "amount", type: "required", message: "必须填写金额" },
          { key: "amount", type: "notEqual", value: 0, message: "金额不能为零" },
          { key: "happen_at", type: "required", message: "必须选择时间" },
        ])
      );
      if (hasError(errors)) {
        Dialog.alert({
          title: "出错",
          message: Object.values(errors)
            .filter((i) => i.length > 0)
            .join("\n"),
        });
        return;
      }
      await http
        .post<Resource<Item>>("/items", formData, { _mock: "itemCreate", _autoLoading: true })
        .catch(onError);
      router.push("/items");
    };
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => "点滴记账",
          icon: () => <OverlayIcon />,
          default: () => (
            <>
              <div class={s.wrapper}>
                <Tabs v-model:selected={formData.kind} class={s.tabs}>
                  <Tab value="expenses" name="支出">
                    <Tags kind="expenses" v-model:selected={formData.tag_ids![0]} />
                  </Tab>
                  <Tab value="income" name="收入">
                    <Tags kind="income" v-model:selected={formData.tag_ids![0]} />
                  </Tab>
                </Tabs>
                <div class={s.inputPad_wrapper}>
                  <InputPad
                    v-model:kind={formData.kind}
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
