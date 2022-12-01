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

/**
 * 为了避免选择标签时，支出标签和收入标签的 id 相同导致的 bug
 * 所以需要将 id 作为一个全局变量
 */
let id = 0;
const createId = () => {
  id += 1;
  return id;
};

// 构造标签数据
export const mockTagIndex: Mock = (config) => {
  const { kind, page } = config.params; // 从请求的配置参数解构出收支类别、当前页数
  const per_page = 25; // 每页只展示 25 个标签
  const count = 26; // 为了测试加载更多标签功能，构造 26 个标签数据，也就是需要两页展示全部标签
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

// 构造编辑标签数据
export const mockTagShow: Mock = (config) => {
  const createTag = (attrs?: any) => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: "expenses",
    ...attrs,
  });
  return [200, { resource: createTag() }];
};

// 构造编辑标签数据
export const mockTagEdit: Mock = (config) => {
  const createTag = (attrs?: any) => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: "expenses",
    ...attrs,
  });
  return [200, { resource: createTag() }];
};

// 构造记账数据
export const mockItemCreate: Mock = (config) => {
  return [
    200,
    {
      resource: {
        id: 2264,
        user_id: 1312,
        amount: 9900,
        note: null,
        tags_id: [3508],
        happen_at: "2020-10-29T16:00:00.000Z",
        created_at: "2022-07-03T15:35:56.301Z",
        updated_at: "2022-07-03T15:35:56.301Z",
        kind: "expenses",
      },
    },
  ];
};

// 构造明细数据
export const mockItemIndex: Mock = (config) => {
  const { kind, page } = config.params; // 从请求的配置参数解构出收支类别、当前页数
  const per_page = 25; // 每页只展示 25 个标签
  const count = 26; // 为了测试加载更多标签功能，构造 26 个标签数据，也就是需要两页展示全部标签
  // 创建一个与「加载更多记账」相关的对象
  const createPager = (page = 1) => ({
    page, // 当前展示标签的页数，默认为第 1 页
    per_page, // 每页能展示的标签个数
    count, // 常用标签列表的总个数
  });
  const createTag = (attrs?: any) => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: "expenses",
    ...attrs,
  });
  // 创建一个包含所有记账（长度为 n，默认为 1）的数组
  const createItem = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      user_id: createId(),
      amount: Math.floor(Math.random() * 10000),
      tags_id: [createId()],
      tags: [createTag()],
      happen_at: faker.date.past().toISOString(),
      kind: config.params.kind,
    }));
  const createBody = (n = 1, attrs?: any) => ({
    resources: createItem(n),
    pager: createPager(page),
    summary: {
      income: 9900,
      expenses: 9900,
      balance: 0,
    },
  });
  if (!page || page === 1) {
    return [200, createBody(25)]; // 明细列表的第 1 页
  } else if (page === 2) {
    return [200, createBody(1)]; // 明细列表的第 2 页
  } else {
    return [200, {}];
  }
};

// 构造总支出、收入、净收入数据
export const mockItemIndexBalance: Mock = (config) => {
  return [
    200,
    {
      expenses: 9900,
      income: 9900,
      balance: 0,
    },
  ];
};

// 构造统计数据
export const mockItemSummary: Mock = (config) => {
  if (config.params.group_by === "happen_at") {
    return [
      200,
      {
        groups: [
          { happen_at: "2022-12-18T00:00:00.000+0800", amount: 100 },
          { happen_at: "2022-12-22T00:00:00.000+0800", amount: 300 },
          { happen_at: "2022-12-29T00:00:00.000+0800", amount: 200 },
        ],
        summary: 600,
      },
    ];
  } else {
    return [
      200,
      {
        groups: [
          { tag_id: 1, tag: { id: 1, name: "消费" }, amount: 50000 },
          { tag_id: 2, tag: { id: 2, name: "吃饭" }, amount: 100000 },
          { tag_id: 3, tag: { id: 3, name: "房租" }, amount: 200000 },
          { tag_id: 3, tag: { id: 3, name: "交通" }, amount: 20000 },
        ],
        summary: 3700,
      },
    ];
  }
};
