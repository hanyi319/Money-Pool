import { defineComponent, onMounted, PropType, reactive, ref, watch } from "vue";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
import { http } from "../../shared/Http";
import { Money } from "../../shared/Money";
import { Datetime } from "../../shared/Datetime";
import s from "./ItemSummary.module.scss";
import { Center } from "../../shared/Center";
import { Icon } from "../../shared/Icon";
import { RouterLink } from "vue-router";

export const ItemSummary = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false,
    },
    endDate: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup: (props, context) => {
    const items = ref<Item[]>([]); // 明细列表，默认为空数组
    const hasMore = ref(false); // 是否要加载更多明细，默认为不加载
    const page = ref(0); // 当前展示标签的页数，默认为 0（也符合未加载时的状态）
    // 盈亏情况，包含对应时间段的支出、收入和结余
    const itemsBalance = reactive({
      expenses: 0,
      income: 0,
      balance: 0,
    });
    // 加载明细
    const fetchItems = async () => {
      // 自定义时间默认为空，不发请求
      if (!props.startDate || !props.endDate) {
        return;
      }
      const response = await http.get<Resources<Item>>(
        "/items",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          page: page.value + 1,
          kind: "expenses",
        },
        {
          _mock: "itemIndex",
          _autoLoading: true,
        }
      );
      // 从请求成功得到的响应解构出明细数据、当前页数
      const { resources, pager } = response.data;
      // 将请求到的明细数据 push 进明细数组
      items.value?.push(...resources);
      /**
       * 因为第 1 次请求成功后 page = 1，所以默认只创建 25 个明细，也就是只有 1 页
       * 比如总共要展示 26 个明细，因为最开始是第 1 页
       * 所以就是 (1 - 1) * 25 + 25 < 26，为 true，所以可以继续加载更多明细
       */
      hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count;
      // 当前页数需要 +1
      page.value += 1;
      /**
       * 注意这里的 page.value 并不等同于 pager.page
       * 它们只是数值需要保持相同，比如在第一次请求成功后，都为 1
       * page 是之前定义的 ref（所以需要取 value 值），pager.page 则是从响应结果里解构出来的（类型为 number）
       * 整个变化可以理解为 page.value 默认为 0，第一次加载明细时传入请求函数并且 +1，之后从响应中作为 pager.page 解构出来
       * 此时 pager.page = 1，但这里的 page.value 仍然为 0，所以需要再次进行 +1 操作
       * 也就是第二次加载标签时，page.value 传入请求函数并且 +1 为 2，这样才能加载下一页的明细
       */
    };
    // 加载盈亏
    const fetchItemsBalance = async () => {
      if (!props.startDate || !props.endDate) {
        return;
      }
      const response = await http.get(
        "/items/balance",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          page: page.value + 1,
        },
        {
          _mock: "itemIndexBalance",
        }
      );
      Object.assign(itemsBalance, response.data);
    };
    onMounted(fetchItems);
    onMounted(fetchItemsBalance);
    /**
     * 自定义时间
     * 监听开始时间和结束时间其中任意一个的变化
     * 重新加载明细和盈亏
     */
    watch(
      () => [props.startDate, props.endDate],
      () => {
        items.value = [];
        hasMore.value = false;
        page.value = 0;
        fetchItems();
      }
    );
    watch(
      () => [props.startDate, props.endDate],
      () => {
        Object.assign(itemsBalance, { expenses: 0, income: 0, balance: 0 });
        fetchItemsBalance();
      }
    );
    return () => (
      <div class={s.wrapper}>
        {items.value && items.value.length > 0 ? (
          <>
            <ul class={s.total}>
              <li>
                <span class={s.expenses}>
                  <Money value={itemsBalance.expenses} />
                </span>
                <span>支出</span>
              </li>
              <li>
                <span class={s.income}>
                  <Money value={itemsBalance.income} />
                </span>
                <span>收入</span>
              </li>
              <li>
                <span class={itemsBalance.expenses > itemsBalance.income ? s.expenses : s.income}>
                  <Money value={itemsBalance.balance} />
                </span>
                <span>结余</span>
              </li>
            </ul>
            <ol class={s.list}>
              {items.value.map((item) => (
                <li>
                  <div class={s.sign}>
                    <span>{item.tags && item.tags.length > 0 ? item.tags[0].sign : "💰"}</span>
                  </div>
                  <div class={s.text}>
                    <div class={s.tagAndAmount}>
                      <span class={s.tag}>
                        {item.tags && item.tags.length > 0 ? item.tags[0].name : "未分类"}
                      </span>
                      <span class={[s.amount, item.kind === "expenses" ? s.expenses : s.income]}>
                        <Money value={item.amount} />
                      </span>
                    </div>
                    <div class={s.time}>
                      <Datetime value={item.happen_at} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div class={s.more}>
              {hasMore.value ? (
                <Button onClick={fetchItems} class={s.loadMore}>
                  加载更多
                </Button>
              ) : (
                <span class={s.noMore}>没有更多</span>
              )}
            </div>
          </>
        ) : (
          <>
            <Center class={s.icon_wrapper}>
              <Icon name="note" class={s.icon} />
            </Center>
            <div class={s.button_wrapper}>
              <RouterLink to="/items/create">
                <Button class={s.button}>开始记账</Button>
              </RouterLink>
            </div>
          </>
        )}
        <RouterLink to="/items/create">
          <FloatButton iconName="add" />
        </RouterLink>
      </div>
    );
  },
});
