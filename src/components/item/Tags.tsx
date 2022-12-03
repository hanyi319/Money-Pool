import { defineComponent, PropType, ref } from "vue";
import { http } from "../../shared/Http";
import { Icon } from "../../shared/Icon";
import { Button } from "../../shared/Button";
import { useTags } from "../../shared/useTags";
import { RouterLink, useRouter } from "vue-router";
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
      return http.get<Resources<Tag>>(
        "/tags",
        {
          kind: props.kind,
          page: page + 1, // 注意需要 +1，比如第一次请求时，page 为 0，需要在这里 +1 才能加载第 1 页的标签
        },
        {
          _mock: "tagIndex",
          _autoLoading: true,
        }
      );
    });
    const onSelect = (tag: Tag) => {
      context.emit("update:selected", tag.id);
    };
    /**
     * 触发长按效果:
     * 设置一个定时器，当用户触摸标签就标记为当前标签并开始计时
     * 如果长按超过一定时间，就跳转到编辑标签页面
     * 如果手指移开或者触摸位置移出了当前标签范围，就取消定时器
     */
    const router = useRouter();
    const timer = ref<number>(); // 定时器
    const currentTag = ref<HTMLDivElement>(); // 当前标签
    // 长按跳转页面
    const onLongPress = (tagId: Tag["id"]) => {
      router.push(
        `/tags/${tagId}/edit?kind=${props.kind}&return_to=${router.currentRoute.value.fullPath}`
      );
    };
    const onTouchStart = (e: TouchEvent, tag: Tag) => {
      // 标记当前标签
      currentTag.value = e.currentTarget as HTMLDivElement;
      // 设置定时器为 0.5s
      timer.value = setTimeout(() => {
        onLongPress(tag.id);
      }, 500);
    };
    // 手指移开就取消定时器
    const onTouchEnd = (e: TouchEvent) => {
      clearTimeout(timer.value);
    };
    // 判断触摸范围
    const onTouchMove = (e: TouchEvent) => {
      // 当前触摸位置所指向的元素
      const pointedElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      // 如果该元素不是当前标签或者不在当前标签的范围内，就取消定时器
      if (
        currentTag.value !== pointedElement &&
        currentTag.value?.contains(pointedElement) === false
      ) {
        clearTimeout(timer.value);
      }
    };
    return () => (
      <>
        <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
          <RouterLink to={`/tags/create?kind=${props.kind}`} class={s.tag}>
            <div class={s.icon_wrapper}>
              <Icon name="add" class={s.createTag} />
            </div>
            <div class={s.name}>新增</div>
          </RouterLink>
          {tags.value.map((tag) => (
            <div
              class={[s.tag, props.selected === tag.id ? s.selected : ""]}
              onClick={() => onSelect(tag)}
              onTouchstart={(e) => onTouchStart(e, tag)}
              onTouchend={onTouchEnd}
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
