---
description: Create a new GraphQL query with fragments, operations, and TanStack Query hooks
---

# GraphQL Workflow

A practical, minimal workflow for creating a new GraphQL query using GraphQL Codegen, graphql-request, and TanStack Query.

## Steps

1. **Start Codegen Watch**
   - Run: `pnpm -C apps/insilico codegen:watch`

2. **Define Fragments (Optional)**
   - Create a fragment file under `apps/insilico/lib/api/gql/fragments/{feature}/...`.
   - Use the `graphql` tag from `@generated/gql`.

3. **Define the Query**
   - Create a file under `apps/insilico/lib/api/gql/queries/{feature}/...`.
   - Write a named operation with the `graphql` tag.

4. **Generate Types**
   - Save the file; codegen will automatically generate types in `lib/__generated__`.

5. **Write API Function**
   - Implement an operation under `apps/insilico/lib/api/gql/operations/...`.
   - Use `graphqlClient.request` with the generated `...Document`.

6. **Create TanStack Query Hook**
   - Expose a hook under `apps/insilico/lib/queries/{feature}/index.ts`.
   - Use query key factories for consistency.

7. **Use in Component**
   - Import and use the hook in your React component.
