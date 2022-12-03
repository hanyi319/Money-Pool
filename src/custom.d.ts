import { AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    _mock?: string;
    _autoLoading?: boolean;
  }
}
