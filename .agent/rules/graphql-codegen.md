---
trigger: always_on
glob: lib/api/gql/**/*.{ts,graphql}
description: GraphQL Codegen usage and best practices
---

# GraphQL Codegen

This guide explains how GraphQL Code Generator is used in the InSilico app to provide automatic TypeScript types and typed operations.

## Overview

The InSilico app uses `@graphql-codegen/*` with the client preset to:
- Infer types for variables and results from your GraphQL operations
- Generate a typed `graphql` tag for authoring queries inline
- Emit reusable, typed `DocumentNode` constants for named operations

Generated artifacts live under `apps/insilico/lib/__generated__/` and should not be edited manually.

## Authoring Queries (graphql tag)

Write named operations inside the generated `graphql` tag. Codegen will infer types and emit typed documents.

```ts
import { graphql } from '@generated/gql'

export const getSequenceInfoMultiOMQuery = graphql(`
  query getSequenceInfoMultiOM($request: MultiOmSeqInfoRequest!) {
    multiOmResult {
      getMultiOmSeqInfoList(request: $request) {
        totalElements
        totalPages
        content {
          ...MultiOmContentFields
        }
      }
    }
  }
`)
```

- Always name operations.
- Keep the string static.
- Variables and results are fully typed and inferred.

## Using Generated Documents

Alternatively, import generated `...Document` constants for reuse.

```ts
import { graphqlClient as client } from '@library/util/graphQL'
import { GetMultiplexAnalyteAndSetListBaseDocument } from '@generated/graphql'

export const getMultiplexAnalyteAndSetListGQL = async (params: { pkgId: string; reqId: string; mltpxId: string; excCnt: number }) => {
  const data = await client.request(GetMultiplexAnalyteAndSetListBaseDocument, params)
  return {
    analyteList: data.multiplexResultSummary.getMultiplexArrayAnalyteList,
    setList: data.multiplexResultSummary.getSetList,
  }
}
```

## Commands (Windows/PowerShell)

- Generate types: `pnpm -C apps/insilico codegen`
- Watch mode: `pnpm -C apps/insilico codegen:watch`
- Refresh schema: `pnpm -C apps/insilico gql:refresh`

## Best Practices

- Use the `graphql` tag for most queries.
- Name every operation.
- Respect scalar types (`Long`, `Int`, etc.).
- Let TypeScript guide you—if it doesn’t type-check, the query likely doesn’t match the schema.
