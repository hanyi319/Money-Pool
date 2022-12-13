import { defineStore } from "pinia";
import { http } from "../shared/Http";

type State = {
  items: Item[];
  itemsBalance: ItemsBalance;
  hasMore: boolean;
  page: number;
};
type Actions = {
  fetchItemsBalance: (startDate?: string, endDate?: string) => void;
  _fetch: (firstPage: boolean, startDate?: string, endDate?: string) => void;
  fetchFirstPage: (startDate?: string, endDate?: string) => void;
  fetchNextPage: (startDate?: string, endDate?: string) => void;
};

// 注意这里直接将 id 写死为 items 会有 bug
export const useItemStore = (id: string | string[]) =>
  defineStore<string, State, {}, Actions>(typeof id === "string" ? id : id.join("-"), {
    state: () => ({
      // 明细列表，默认为空数组
      items: [],
      // 收支总览，包含对应时间段的支出、收入和结余
      itemsBalance: {
        expenses: 0,
        income: 0,
        balance: 0,
      },
      // 是否要加载更多明细，默认为不加载
      hasMore: false,
      // 当前展示标签的页数，默认为 0（也符合未加载时的状态）
      page: 0,
    }),
    actions: {
      // 加载收支总览
      async fetchItemsBalance(startDate, endDate) {
        if (!startDate || !endDate) {
          return;
        }
        const response = await http.get(
          "/items/balance",
          {
            happen_after: startDate,
            happen_before: endDate,
          },
          {
            _mock: "itemIndexBalance",
          }
        );
        Object.assign(this.itemsBalance, response.data);
      },
      async _fetch(firstPage, startDate, endDate) {
        // 自定义时间默认为空，不发请求
        if (!startDate || !endDate) {
          return;
        }
        const response = await http.get<Resources<Item>>(
          "/items",
          {
            happen_after: startDate,
            happen_before: endDate,
            page: firstPage ? 1 : this.page + 1,
          },
          {
            _mock: "itemIndex",
            _autoLoading: true,
          }
        );
        // 从请求成功得到的响应解构出明细数据、当前页数
        const { resources, pager } = response.data;
        /**
         * 如果是加载第一页，那么就直接用响应结果覆盖当前数据
         * 如果是加载下一页，那么就将响应结果 push 进明细数组
         */
        if (firstPage) {
          this.items = resources;
        } else {
          this.items?.push(...resources);
        }
        /**
         * 因为第 1 次请求成功后 page = 1，所以默认只创建 25 个明细，也就是只有 1 页
         * 比如总共要展示 26 个明细，因为最开始是第 1 页
         * 所以就是 (1 - 1) * 25 + 25 < 26，为 true，所以可以继续加载更多明细
         */
        this.hasMore = (pager.page - 1) * pager.per_page + resources.length < pager.count;
        // 当前页数需要 +1
        this.page += 1;
        /**
         * 注意这里的 page.value 并不等同于 pager.page
         * 它们只是数值需要保持相同，比如在第一次请求成功后，都为 1
         * page 是之前定义的 ref（所以需要取 value 值），pager.page 则是从响应结果里解构出来的（类型为 number）
         * 整个变化可以理解为 page.value 默认为 0，第一次加载明细时传入请求函数并且 +1，之后从响应中作为 pager.page 解构出来
         * 此时 pager.page = 1，但这里的 page.value 仍然为 0，所以需要再次进行 +1 操作
         * 也就是第二次加载标签时，page.value 传入请求函数并且 +1 为 2，这样才能加载下一页的明细
         */
      },
      // 加载第一页明细
      async fetchFirstPage(startDate, endDate) {
        this._fetch(false, startDate, endDate);
      },
      // 加载下一页明细
      async fetchNextPage(startDate, endDate) {
        this._fetch(true, startDate, endDate);
      },
    },
  })();
