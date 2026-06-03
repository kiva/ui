# MP-2866 — Goal signup copy variant helper

**Ticket:** MP-2866 (foundation for epic MP-2855)
**Date:** 2026-06-03
**Status:** Draft

## Summary

Add a shared helper that returns the current "goal signup copy variant" based on the system date. Four existing entrypoints (Thanks page, Portfolio Impact Dashboard, MyKiva NextYearGoalCard, MyKiva GoalSelector) currently choose between "last-year" copy (`titleLastYear*` / `titleNoHistoryWomensDefault`) and "no-goal-yet" copy (`CARD_NO_GOAL_YET_EXPERIMENT` / `CARD_HABIT_PROMPT_EXPERIMENT`) with ad-hoc logic. This helper centralizes the calendar-driven gate that determines which bucket of copy is eligible to display.

## Scope

**In scope:** the helper module, its exports, and unit tests.

**Out of scope:** updating the four existing entrypoints. Wiring is reserved for follow-up MP-2855 tickets to keep this PR small and reviewable.

## Variant rules

| Local date range | Variant |
|---|---|
| Jan 1 00:00 – Mar 31 23:59 | `last-year` |
| Apr 1 00:00 – Dec 31 23:59 | `no-goal-yet` |

- Year-agnostic. Comparison reads month/day only, never `getFullYear()`.
- Uses `Date#getMonth()` / `getDate()`, which read local browser time (no UTC conversion). This matches the ticket's "default to lender's local browser time unless otherwise specified."
- Leap years: boundary is Apr 1, so Feb 29 is irrelevant. No leap-year test.

### 2026 rollout exception

Today (2026-06-03) is already past Apr 1, so the evergreen rule already returns `no-goal-yet` for the rest of 2026. No special-case code. A unit test pinned to a May 2026 reference date demonstrates this in CI.

### PM confirmation pending

The ticket notes: "Confirm with PM whether the date switch should respect a specific timezone (e.g., Pacific) or use the lender's local browser time. Default to lender's local browser time unless otherwise specified." This design ships local-time and can be revised to a fixed timezone (e.g., `America/Los_Angeles` via `Intl.DateTimeFormat`) if PM disagrees — that change is localized to `resolveGoalSignupCopyVariant`.

## Module layout

**File:** `src/composables/useGoalSignupCopyVariant.js`

Three exports:

1. **`GOAL_SIGNUP_COPY_VARIANT`** — frozen constants object so consumers can compare against named values instead of magic strings.
   ```js
   export const GOAL_SIGNUP_COPY_VARIANT = Object.freeze({
     LAST_YEAR: 'last-year',
     NO_GOAL_YET: 'no-goal-yet',
   });
   ```

2. **`resolveGoalSignupCopyVariant(date)`** — pure function, the unit under test. Exported alongside the composable so tests can hit boundary dates directly without mounting a Vue tree.
   ```js
   const NO_GOAL_YET_START_MONTH = 3; // April (0-indexed)
   const NO_GOAL_YET_START_DAY = 1;

   export function resolveGoalSignupCopyVariant(date = new Date()) {
     const month = date.getMonth();
     const day = date.getDate();
     const onOrAfterApr1 =
       month > NO_GOAL_YET_START_MONTH
       || (month === NO_GOAL_YET_START_MONTH && day >= NO_GOAL_YET_START_DAY);
     return onOrAfterApr1
       ? GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET
       : GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR;
   }
   ```

3. **`useGoalSignupCopyVariant({ now } = {})`** — default export, the composable. Returns `{ variant }` where `variant` is a `ComputedRef<string>`. Optional `now` accepts a `Date` to pin the value in tests.
   ```js
   import { computed } from 'vue';

   export default function useGoalSignupCopyVariant({ now } = {}) {
     const variant = computed(() => resolveGoalSignupCopyVariant(now ?? new Date()));
     return { variant };
   }
   ```

## Reactivity notes

The `computed` wrapper has no reactive input — `now ?? new Date()` resolves once at composable-call time and caches forever. Across a realistic SSR + first-render lifespan, the variant cannot flip mid-session unless someone keeps the tab open across the Jan 1 or Apr 1 midnight boundary, which is an explicit non-goal. Keeping the signature simple (no reactive `now` ref, no interval polling) avoids over-design.

## Consumer call site (preview, not in this PR)

```js
import useGoalSignupCopyVariant, {
  GOAL_SIGNUP_COPY_VARIANT,
} from '#src/composables/useGoalSignupCopyVariant';

const { variant } = useGoalSignupCopyVariant();
// variant.value === 'last-year' | 'no-goal-yet'

if (variant.value === GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR) {
  // render titleLastYear* copy
} else {
  // render CARD_NO_GOAL_YET_EXPERIMENT copy
}
```

## Testing

**File:** `test/unit/specs/composables/useGoalSignupCopyVariant.spec.js`

Tested almost entirely against the pure `resolveGoalSignupCopyVariant` function. The composable wrapper gets one smoke test.

### Pure-function cases

| Input date | Expected variant | Why |
|---|---|---|
| `2026-01-01T00:00:00` | `last-year` | Start-of-year boundary |
| `2026-03-31T23:59:59` | `last-year` | Last moment of last-year window |
| `2026-04-01T00:00:00` | `no-goal-yet` | First moment of no-goal-yet window |
| `2026-12-31T23:59:59` | `no-goal-yet` | End-of-year boundary |
| `2026-05-15T12:00:00` | `no-goal-yet` | 2026 rollout proof (per acceptance criteria) |
| `2025-03-15T12:00:00` | `last-year` | Cross-year evergreen check (different year, mid-Q1) |
| `2027-07-04T12:00:00` | `no-goal-yet` | Cross-year evergreen check (different year, mid-Q2+) |

### Composable smoke test

```js
it('exposes variant via computed ref', () => {
  const { variant } = useGoalSignupCopyVariant({ now: new Date('2026-05-15') });
  expect(variant.value).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
});
```

## Out of scope

- Updating Thanks/SingleVersion/GoalEntrypoint.vue, Portfolio/ImpactDashboard/GoalEntrypoint.vue, MyKiva/NextYearGoalCard.vue, MyKiva/GoalSetting/GoalSelector.vue — follow-up MP-2855 tickets.
- Server-side date overrides, feature-flag gates, or A/B tests on top of the variant.
- Reactive midnight rollover (keeping the tab open across the boundary will not update the variant).
- Pacific-time / fixed-timezone variant unless PM confirms.
