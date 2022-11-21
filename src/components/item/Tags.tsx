import { defineComponent, PropType } from "vue";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import { Button } from "../../shared/Button";
import { useTags } from "../../shared/useTags";
import s from "./Tags.module.scss";

export const Tags = defineComponent({
  props: {
    kind: {
      type: String as PropType<string>,
    },
    selected: Number,
  },
  emits: ["update:selected"],
  setup: (props, context) => {
    /**
     * 使用 useTags 结构出：
     * 标签数组、是否要加载更多标签、加载标签函数
     *
     * 并给 useTags 传入一个请求函数，相关配置参数为：
     * 交易类别、当前展示标签的页数、调用哪种 mock 函数
     */
    const { tags, hasMore, fetchTags } = useTags((page) => {
      return http.get<Resources<Tag>>("/tags", {
        kind: props.kind,
        page: page + 1, // 注意需要 +1，比如第一次请求时，page 为 0，需要在这里 +1 才能加载第 1 页的标签
        _mock: "tagIndex",
      });
    });
    const onSelect = (tag: Tag) => {
      context.emit("update:selected", tag.id);
    };
    return () => (
      <>
        <div class={s.tags_wrapper}>
          <div class={s.tag}>
            <div class={s.icon_wrapper}>
              <Icon name="add" class={s.createTag} />
            </div>
            <div class={s.name}>新增</div>
          </div>
          {tags.value.map((tag) => (
            <div
              class={[s.tag, props.selected === tag.id ? s.selected : ""]}
              onClick={() => onSelect(tag)}
            >
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.name}>{tag.name}</div>
            </div>
          ))}
        </div>
        <div class={s.more}>
          {hasMore ? (
            <Button class={s.loadMore} onClick={fetchTags}>
              加载更多
            </Button>
          ) : (
            <span class={s.noMore}>暂无更多</span>
          )}
        </div>
      </>
    );
  },
});
