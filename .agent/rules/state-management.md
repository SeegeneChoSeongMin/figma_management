---
trigger: always_on
glob: *.ts, *.tsx
description: State management patterns and migration guides for OneSystem Portal Web
---

# State Management

This document covers state management patterns for OneSystem Portal Web.

## Zustand Store Patterns

Zustand is the preferred solution for client-side state.

### Key Principles:
- Use Immer middleware for immutable state updates.
- Organize stores by feature/domain.
- Use selectors to access store state to prevent unnecessary rerenders.

### Example Store Structure:
```typescript
export const useFeatureStore = create<FeatureState>()(
  immer((set) => ({
    data: [],
    setData: (data) =>
      set((state) => {
        state.data = data
      }),
  }))
)
```

## URL Query Parameters

Use the `useQueryParams` hook for accessing URL parameters in a type-safe way.

```typescript
const { query, isInitialized } = useQueryParams(['reqId', 'anlId'])
const { reqId, anlId } = query

if (!isInitialized) {
  return <Loading />
}
```

## React Query Patterns

TanStack Query is used for server state management.

### Query Key Factories:
```typescript
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: (params: ListParams) => [...featureKeys.lists(), params] as const,
}
```

## Migrating from Jotai

The project is moving away from Jotai in favor of custom hooks and React Query.

### useHostListStore → useHostSettingStore
- **Old Path**: `@store/client/common/hostList`
- **New Path**: `@store/client/create/ptod`
- **Key Actions**: `resetHostData`, `setHostList`, `setHasHostModifications`.

### Manual Page Init → useHeaderInfo
Instead of multiple atoms (`pageInitAtom`, `fetchPageInfoAtom`), use `useHeaderInfo`:
```typescript
const headerInfo = useHeaderInfo({
  title: 'Page Title',
  pageType: PageType.Analyte,
  isReadyToInit: isFetched,
  initializer(codes) {
    return [
      { listTitle: 'ID', listInfo: resAnlId },
    ].filter((v) => !!v.listInfo)
  },
})
```
