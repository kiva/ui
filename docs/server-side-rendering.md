# Server-Side Rendering Scope Rules

The SSR module graph is shared by many requests: production renders run in pooled worker threads, and a worker's modules are evaluated once and reused for every request the worker serves. Module-level state is therefore worker-scoped, not request-scoped. Place state accordingly:

- **Module scope**: only request-invariant data, such as query documents, pure functions, config-derived memos, and registered composable operations.
- **Per-request instances**: anything that varies by request or user. The apollo client and `cookieStore` are created per request in `createApp` and provided through the app; new per-request state belongs in the same pattern.
- **Apollo cache**: data that must transfer from server to client. It is serialized into `__APOLLO_STATE__` per request and restored before hydration.

Never store request or user data in module scope. It leaks across requests on a shared worker.
