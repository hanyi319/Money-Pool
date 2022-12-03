# 点滴记账 Money-Stream

## 如何开发

## 如何打包

## 编码规范

### ref 默认值

不推荐使用

```tsx
const div = ref<HTMLDivElement>();
```

推荐使用

```tsx
const div = ref<HTMLDivElement | null>(null);
```
