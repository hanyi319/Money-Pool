import { AxiosError } from "axios";

// 处理表单提交时的错误
export const onFormError = (
  error: AxiosError<ResourceError>,
  fn: (errors: ResourceError) => void
) => {
  if (error.response?.status === 422) {
    fn(error.response.data);
  }
  throw error;
};
