# Loan Search Utilities

## Overview

The loan search utilities are used for the `lend/filter` and help to provide filtered loans fetched from the FLSS API. There are a handful of Vue components for rendering the different filters, but the primary business logic exists in `LoanSearchInterface.vue`. The current state of the filters are held in this interface component, and the underlying state is stored in the Apollo cache in the `loanSearchState` object.

Within the `LoanSearchInterface` there is an Apollo `watchQuery` that monitors the `loanSearchState` and runs the filtered loan query. The watch callback also updates the query params.

While the `loanSearchState` triggers fetching filtered loans, the query params can also be seen as a second driver for what filters are applied to the loans query. When the query params are changed, the `loanSearchState` is updated, and the filtered loans query runs again as long as the state changed.

If the loan filtering needs to be updated, either the `loanSearchState` in the Apollo cache or the query params can be updated, and these loan search utilities provide both methods of updating the filtering.

## Facets

The concept of "facets" are the available filters, and the lend API is the source of truth. On the `lend/filter` page, facet options are only displayed if the option exists in the FLSS API, but the option information is sourced from the lend API. The loan count per facet option is provided by the FLSS API, so consistency remains between the FLSS API loan result count and filter loan count.

There is one exception to defining filter options and that is the theme/attribute filter options. Here there is a collection of themes that are always displayed. The filter option information is once again sourced from the lend API, but the static filter options will be displayed regardless of whether the options are returned by the FLSS API.

## searchStateUtils

Here are the functions for updating the `loanSearchState` in the Apollo cache. Before saving new state, make sure to run `getValidatedSearchState` to ensure that the state will result in valid filters for the GraphQL loans query.

## queryParamUtils

These functions provide ways to both add to the query params and parse the filter values from the URL. Because there are a few different versions of the lend filter page (FLSS, Algolia, legacy), there are several query param formats that need to be supported.

## dataUtils

Most of these functions are wrappers for the flssUtils functions, with either input or output adjustments as needed for the loan search filters. All data passed to and from the filtering UI goes through these functions.

## filterUtils

Whenever data needs to be adjusted before being displayed in the filter UI, an appropriate function is added to this collection. There are also some constants that control which filter values are displayed to the user, such as which loan themes to display.

## countryUtils

The country facets, particularly the ISO codes, require special handling. The facet data from the lend and FLSS APIs have different properties available, but both data sources are needed in order to get the country facets ready for the UI.
