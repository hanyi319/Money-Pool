import { defineComponent, PropType, watch } from "vue";
import { Button } from "../../shared/Button";
import { FloatButton } from "../../shared/FloatButton";
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
    const itemStore = useItemStore(["items", props.startDate, props.endDate]);

    // 只有当用户登录时，才去加载对应时间段的记账数据
    useAfterMe(() => itemStore.fetchItemsBalance(props.startDate, props.endDate));
    useAfterMe(() => itemStore.fetchFirstPage(props.startDate, props.endDate));

    /**
     * 监听起止时间其中任意一个的变化（也就是切换 Tab 时）
     * 重新加载收支总览和明细列表
     */
    watch(
      () => [props.startDate, props.endDate],
      () => {
        itemStore.$reset();
        itemStore.fetchItemsBalance(props.startDate, props.endDate);
        itemStore.fetchFirstPage(props.startDate, props.endDate);
      }
    );
    return () =>
      !props.startDate || !props.endDate ? (
        <>
          <Center class={s.icon_wrapper} direction="|">
            <Icon name="clock" class={s.icon} />
            <p>请先选择时间范围</p>
          </Center>
        </>
      ) : (
        <div class={s.wrapper}>
          {itemStore.items && itemStore.items.length > 0 ? (
            <>
              <ul class={s.total}>
                <li>
                  <span class={s.expenses}>
                    <Money value={itemStore.itemsBalance.expenses} />
                  </span>
                  <span>支出</span>
                </li>
                <li>
                  <span class={s.income}>
                    <Money value={itemStore.itemsBalance.income} />
                  </span>
                  <span>收入</span>
                </li>
                <li>
                  <span
                    class={
                      itemStore.itemsBalance.expenses > itemStore.itemsBalance.income
                        ? s.expensesBalance
                        : s.incomeBalance
                    }
                  >
                    <Money value={itemStore.itemsBalance.balance} />
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
                          <span
                            class={[s.amount, item.kind === "expenses" ? s.expenses : s.income]}
                          >
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
                    onClick={() => itemStore.fetchNextPage(props.startDate, props.endDate)}
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
              <Center class={s.icon_wrapper} direction="|">
                <Icon name="note" class={s.icon} />
                <p>目前没有数据</p>
              </Center>
              <div class={s.button_wrapper}>
                <RouterLink to="/notes">
                  <Button class={s.button}>开始记账</Button>
                </RouterLink>
              </div>
            </>
          )}
          <RouterLink to="/notes">
            <FloatButton iconName="add" />
          </RouterLink>
        </div>
      );
  },
});
