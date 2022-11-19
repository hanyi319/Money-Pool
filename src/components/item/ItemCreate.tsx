import { defineComponent, onMounted, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../shared/Button";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import { Tabs, Tab } from "../../shared/Tabs";
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
    const refPage = ref(0); // 当前展示标签的页数，默认为 0（也符合未加载时的状态）
    const refHasMore = ref(false); // 是否要加载更多标签，默认为不加载
    onMounted(async () => {
      const response = await http.get<Resources<Tag>>("/tags", {
        kind: "expenses",
        _mock: "tagIndex",
      });
      const { resources, pager } = response.data;
      // 因为第 1 次请求没有传 page 参数，所以默认只创建 25 个标签，也就是只有 1 页
      refExpensesTags.value = resources;
      // 比如总共要展示 26 个标签，因为最开始是第 1 页，所以就是 (1 - 1) * 25 + 25 < 26，为 true
      refHasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count;
    });
    const refExpensesTags = ref<Tag[]>([]);
    onMounted(async () => {
      const response = await http.get<{ resources: Tag[] }>("/tags", {
        kind: "income",
        _mock: "tagIndex",
      });
      refIncomeTags.value = response.data.resources;
    });
    const refIncomeTags = ref<Tag[]>([]);
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => "记一笔",
          icon: () => <Icon name="back" class={s.navIcon} />,
          default: () => (
            <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={(name) => (refKind.value = name)}> */}
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
                      {refExpensesTags.value.map((tag) => (
                        <div class={[s.tag, s.selected]}>
                          <div class={s.sign}>{tag.sign}</div>
                          <div class={s.name}>{tag.name}</div>
                        </div>
                      ))}
                    </div>
                    <div class={s.more}>
                      {refHasMore ? (
                        <Button class={s.loadMore}>加载更多</Button>
                      ) : (
                        <span class={s.noMore}>暂无更多</span>
                      )}
                    </div>
                  </Tab>
                  <Tab name="收入" class={s.tags_wrapper}>
                    <div class={s.tag}>
                      <div class={s.icon_wrapper}>
                        <Icon name="add" class={s.createTag} />
                      </div>
                      <div class={s.name}>新增</div>
                    </div>
                    {refIncomeTags.value.map((tag) => (
                      <div class={[s.tag, s.selected]}>
                        <div class={s.sign}>{tag.sign}</div>
                        <div class={s.name}>{tag.name}</div>
                      </div>
                    ))}
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
