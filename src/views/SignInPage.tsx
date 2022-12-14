import { defineComponent, reactive, ref } from "vue";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { Icon } from "../shared/Icon";
import { validate, hasError } from "../shared/validate";
import { http } from "../shared/Http";
import { useBool } from "../hooks/useBool";
import { useRoute, useRouter } from "vue-router";
import { useMeStore } from "../stores/useMeStore";
import s from "./SignInPage.module.scss";

export const SignInPage = defineComponent({
  setup: (props, context) => {
    const meStore = useMeStore(); // 状态管理
    const router = useRouter(); // 路由器
    const route = useRoute(); // 路由信息
    const formData = reactive({
      email: "2387870957@qq.com",
      code: "123456",
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
          .post<{ jwt: string }>("/session", formData, { _autoLoading: true })
          .catch(onError);
        localStorage.setItem("jwt", response.data.jwt);
        const returnTo = route.query.return_to?.toString();
        meStore.refreshMe();
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
      await http
        .post(
          "/validation_codes",
          { email: formData.email },
          {
            _autoLoading: true,
          }
        )
        .catch(onError)
        .finally(enable);
      // 成功
      refValidationCode.value.startCount();
    };
    return () => (
      <MainLayout>
        {{
          title: () => "",
          icon: () => "",
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon name="logo" class={s.icon} />
                <h1 class={s.appName}>点滴记账</h1>
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
                  placeholder="输入验证码"
                  ref={refValidationCode}
                  countFrom={10}
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

export default SignInPage;
