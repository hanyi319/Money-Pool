import { defineComponent, PropType, reactive, ref } from "vue";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { Icon } from "../shared/Icon";
import { validate, hasError } from "../shared/validate";
import s from "./SignInPage.module.scss";
import axios from "axios";
import { http } from "../shared/Http";
import { useBool } from "../hooks/useBool";
import { history } from "../shared/history";
import { useRoute, useRouter } from "vue-router";
import { refreshMe } from "../shared/me";

export const SignInPage = defineComponent({
  setup: (props, context) => {
    const router = useRouter(); // 路由器
    const route = useRoute(); // 路由信息
    const formData = reactive({
      email: "",
      code: "",
    });
    const errors = reactive({
      email: [],
      code: [],
    });
    const refValidationCode = ref<any>();
    const { ref: refDisabled, toggle, on: disabled, off: enable } = useBool(false);
    const onSubmit = async (e: Event) => {
      e.preventDefault(); // 阻止默认事件，也就是提交后自动刷新页面
      Object.assign(errors, { email: [], code: [] });
      Object.assign(
        errors,
        validate(formData, [
          { key: "email", type: "required", message: "未填写邮箱" },
          { key: "email", type: "pattern", regex: /.+@.+/, message: "格式错误" },
          { key: "code", type: "required", message: "未填写验证码" },
        ])
      );
      if (!hasError(errors)) {
        const response = await http
          .post<{ jwt: string }>("/session", formData, {
            params: { _mock: "session" },
          })
          .catch(onError);
        localStorage.setItem("jwt", response.data.jwt);
        // router.push("/sign_in?return_to=" + encodeURIComponent(route.fullPath));
        const returnTo = route.query.return_to?.toString();
        // const returnTo = localStorage.getItem("returnTo");
        refreshMe();
        router.push(returnTo || "/");
      }
    };
    const onError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors);
      }
      throw error;
    };
    const onClickSendValidationCode = async () => {
      disabled();
      const response = await http
        .post("/validation_codes", { email: formData.email })
        .catch(onError)
        .finally(enable);
      // 成功
      refValidationCode.value.startCount();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "登录",
          icon: () => <Icon name="back" />,
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon name="logo" class={s.icon} />
                <h1 class={s.appName}>清流记账</h1>
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem
                  label="邮箱地址"
                  type="text"
                  placeholder="请输入邮箱，然后点击发送验证码"
                  v-model={formData.email}
                  error={errors.email?.[0]}
                />
                <FormItem
                  label="验证码"
                  type="validationCode"
                  placeholder="请输入六位数字"
                  ref={refValidationCode}
                  countFrom={60}
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code}
                  error={errors.code?.[0]}
                />
                <FormItem style={{ paddingTop: "48px" }}>
                  <Button type="submit">登录</Button>
                </FormItem>
              </Form>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
