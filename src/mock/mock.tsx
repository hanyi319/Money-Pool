import { faker } from "@faker-js/faker";
import { AxiosRequestConfig } from "axios";

type Mock = (config: AxiosRequestConfig) => [number, any];

faker.setLocale("zh_CN");

// 构造登录数据
export const mockSession: Mock = (config) => {
  return [
    200,
    {
      jwt: faker.random.word(),
    },
  ];
};

// 构造标签数据
export const mockTagIndex: Mock = (config) => {
  const { kind, page } = config.params; // 从请求的配置参数解构出收支类别、当前页数
  const per_page = 25; // 每页只展示 25 个标签
  const count = 26; // 为了测试加载更多标签功能，构造 26 个标签数据，也就是需要两页展示全部标签
  let id = 0;
  const createId = () => {
    id += 1;
    return id;
  };
  // 创建一个与「加载更多标签」相关的对象
  const createPager = (page = 1) => ({
    page, // 当前展示标签的页数，默认为第 1 页
    per_page, // 每页能展示的标签个数
    count, // 常用标签列表的总个数
  });
  // 创建一个包含所有标签的数组
  const createTag = (n = 1, attrs?: any) =>
    // 构造一个长度为 n 的数组（默认为 1）
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: config.params.kind,
      ...attrs,
    }));
  const createBody = (n = 1, attrs?: any) => ({
    resources: createTag(n),
    pager: createPager(page),
  });
  if (kind === "expenses" && (!page || page === 1)) {
    return [200, createBody(25)]; // 支出标签的第 1 页
  } else if (kind === "expenses" && page === 2) {
    return [200, createBody(1)]; // 支出标签的第 2 页
  } else if (kind === "income" && (!page || page === 1)) {
    return [200, createBody(25)]; // 收入标签的第 1 页
  } else {
    return [200, createBody(1)]; // 收入标签的第 2 页
  }
};
