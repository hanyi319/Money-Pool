import { defineComponent, PropType, reactive, watch } from "vue";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
import { http } from "../../shared/Http";
import { Money } from "../../shared/Money";
import { Datetime } from "../../shared/Datetime";
import { Center } from "../../shared/Center";
import { Icon } from "../../shared/Icon";
import { RouterLink } from "vue-router";
import { useAfterMe } from "../../hooks/useAfterMe";
import { useItemStore } from "../../stores/useItemStore";
import s from "./ItemSummary.module.scss";

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
  setup: (props) => {
    if (!props.startDate || !props.endDate) {
      return () => <div>请先选择时间范围</div>;
    }
    const itemStore = useItemStore(["items", props.startDate, props.endDate]);
    // 盈亏情况，包含对应时间段的支出、收入和结余
    const itemsBalance = reactive({
      expenses: 0,
      income: 0,
      balance: 0,
    });
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
        },
        {
          _mock: "itemIndexBalance",
        }
      );
      Object.assign(itemsBalance, response.data);
    };
    // 只有当用户登录时，才去加载对应时间段的记账数据
    useAfterMe(() => itemStore.fetchItems(props.startDate, props.endDate));
    useAfterMe(fetchItemsBalance);
    /**
     * 自定义时间
     * 监听开始时间和结束时间其中任意一个的变化
     * 重新加载明细和盈亏
     */
    watch(
      () => [props.startDate, props.endDate],
      () => {
        itemStore.reset();
        itemStore.fetchItems();
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
        {itemStore.items && itemStore.items.length > 0 ? (
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
                <span
                  class={
                    itemsBalance.expenses > itemsBalance.income
                      ? s.expensesBalance
                      : s.incomeBalance
                  }
                >
                  <Money value={itemsBalance.balance} />
                </span>
                <span>结余</span>
              </li>
            </ul>
            <div class={s.listWrapper}>
              <div class={s.export}></div>
              <ol class={s.list}>
                {itemStore.items.map((item) => (
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
            </div>
            <div class={s.more}>
              {itemStore.hasMore ? (
                <Button
                  onClick={() => itemStore.fetchItems(props.startDate, props.endDate)}
                  class={s.loadMore}
                >
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
