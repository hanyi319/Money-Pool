import { defineComponent, PropType, reactive } from "vue";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { Icon } from "../shared/Icon";
import s from "./SignInPage.module.scss";
import { validate } from "../shared/validate";

export const SignInPage = defineComponent({
  setup: (props, context) => {
    const formData = reactive({
      email: "",
      code: "",
    });
    const errors = reactive({
      email: [],
      code: [],
    });
    const onSubmit = (e: Event) => {
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
    };
    const onClickSendValidationCode = () => {
      console.log("ok");
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
                  onClick={onClickSendValidationCode}
                  v-model={formData.code}
                  error={errors.code?.[0]}
                />
                <FormItem style={{ paddingTop: "48px" }}>
                  <Button>登录</Button>
                </FormItem>
              </Form>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
