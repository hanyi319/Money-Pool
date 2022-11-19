import { defineComponent, onMounted, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
import { useTags } from "../../shared/useTags";
import { InputPad } from "./InputPad";
import s from "./ItemCreate.module.scss";

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refKind = ref("支出"); // 交易类别，默认为「支出」
    /**
     * 使用 useTags 结构出：
     * 标签数组、是否要加载更多标签、加载标签函数
     *
     * 并给 useTags 传入一个请求函数，相关配置参数为：
     * 交易类别、当前展示标签的页数、调用哪种 mock 函数
     */
    const {
      tags: expensesTags, // 为了避免和支出标签数组重复，取一个别名
      hasMore: expensesHasMore,
      fetchTags: expensesFetchTags,
    } = useTags((page) => {
      return http.get<Resources<Tag>>("/tags", {
        kind: "expenses",
        page: page + 1, // 注意需要 +1，比如第一次请求时，page 为 0，需要在这里 +1 才能加载第 1 页的标签
        _mock: "tagIndex",
      });
    });
    const {
      tags: incomeTags,
      hasMore: incomeHasMore,
      fetchTags: incomeFetchTags,
    } = useTags((page) => {
      return http.get<Resources<Tag>>("/tags", {
        kind: "income",
        page: page + 1,
        _mock: "tagIndex",
      });
    });
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => "记账",
          icon: () => <Icon name="back" class={s.navIcon} />,
          default: () => (
            <>
              <div class={s.wrapper}>
                <Tabs v-model:selected={refKind.value} class={s.tabs}>
                  <Tab name="支出">
                    <div class={s.tags_wrapper}>
                      <div class={s.tag}>
                        <div class={s.icon_wrapper}>
                          <Icon name="add" class={s.createTag} />
                        </div>
                        <div class={s.name}>新增</div>
                      </div>
                      {expensesTags.value.map((tag) => (
                        <div class={[s.tag, s.selected]}>
                          <div class={s.sign}>{tag.sign}</div>
                          <div class={s.name}>{tag.name}</div>
                        </div>
                      ))}
                    </div>
                    <div class={s.more}>
                      {expensesHasMore ? (
                        <Button class={s.loadMore} onClick={expensesFetchTags}>
                          加载更多
                        </Button>
                      ) : (
                        <span class={s.noMore}>暂无更多</span>
                      )}
                    </div>
                  </Tab>
                  <Tab name="收入">
                    <div class={s.tags_wrapper}>
                      <div class={s.tag}>
                        <div class={s.icon_wrapper}>
                          <Icon name="add" class={s.createTag} />
                        </div>
                        <div class={s.name}>新增</div>
                      </div>
                      {incomeTags.value.map((tag) => (
                        <div class={[s.tag, s.selected]}>
                          <div class={s.sign}>{tag.sign}</div>
                          <div class={s.name}>{tag.name}</div>
                        </div>
                      ))}
                    </div>
                    <div class={s.more}>
                      {incomeHasMore ? (
                        <Button class={s.loadMore} onClick={incomeFetchTags}>
                          加载更多
                        </Button>
                      ) : (
                        <span class={s.noMore}>暂无更多</span>
                      )}
                    </div>
                  </Tab>
                </Tabs>
                <div class={s.inputPad_wrapper}>
                  <InputPad />
                </div>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
