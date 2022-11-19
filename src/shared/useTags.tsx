import { AxiosResponse } from "axios";
import { onMounted, ref } from "vue";

type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>;

// 加载标签
export const useTags = (fetcher: Fetcher) => {
  const page = ref(0); // 当前展示标签的页数，默认为 0（也符合未加载时的状态）
  const hasMore = ref(false); // 是否要加载更多标签，默认为不加载
  const tags = ref<Tag[]>([]); // 常用标签列表，默认为空数组
  const fetchTags = async () => {
    /**
     * fetcher 是外部传进来的请求函数
     * 需要一个当前页数 page 的参数，换言之需要知道请求第几页的标签
     */
    const response = await fetcher(page.value);
    // 从请求成功得到的响应解构出标签数据、当前页数
    const { resources, pager } = response.data;
    // 将请求到的标签数据 push 进标签数组
    tags.value.push(...resources);
    /**
     * 因为第 1 次请求成功后 page = 1，所以默认只创建 25 个标签，也就是只有 1 页
     * 比如总共要展示 26 个标签，因为最开始是第 1 页
     * 所以就是 (1 - 1) * 25 + 25 < 26，为 true，所以可以继续加载更多标签
     */
    hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count;
    // 当前页数需要 +1
    page.value += 1;
    /**
     * 注意这里的 page.value 并不等同于 pager.page
     * 它们只是数值需要保持相同，比如在第一次请求成功后，都为 1
     * page 是之前定义的 ref（所以需要取 value 值），pager.page 则是从响应结果里解构出来的（类型为 number）
     * 整个变化可以理解为 page.value 默认为 0，第一次加载标签时传入请求函数并且 +1，之后从响应中作为 pager.page 解构出来
     * 此时 pager.page = 1，但这里的 page.value 仍然为 0，所以需要再次进行 +1 操作
     * 也就是第二次加载标签时，page.value 传入请求函数并且 +1 为 2，这样才能加载下一页的标签
     */
  };
  onMounted(fetchTags);
  return { page, hasMore, tags, fetchTags };
};
