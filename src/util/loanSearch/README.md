# Loan Search Utilities

## Overview

The loan search utilities provide functionality for filtering loans fetched from the FLSS API. These utilities are used by various components that need to display loan filtering capabilities. The utilities handle filter state management, query parameter parsing, and facet data processing.

## Facets

The concept of "facets" represents the available filters. The lend API is the source of truth for facet options. Facet options are only displayed if they exist in the FLSS API, with option information sourced from the lend API. The loan count per facet option is provided by the FLSS API, ensuring consistency between FLSS API results and filter loan counts.

One exception is the theme/attribute filter options—these are statically defined and always displayed regardless of FLSS API response.

## queryParamUtils

These functions provide ways to add to query parameters and parse filter values from the URL. Since different versions of the lend filter interface may exist, several query param formats need to be supported. The `hasExcludedQueryParams` function is used by SearchBar.vue to determine when to redirect to the legacy filter interface.

## dataUtils

Most functions are wrappers for flssUtils functions, with input or output adjustments as needed for loan search filters. All data passed to and from filtering UIs goes through these functions.

## filterUtils

This module contains functions that adjust data for display in filter UIs. It also contains constants that control which filter values are displayed to users, such as which loan themes to display.

## countryUtils

Country facets, particularly ISO codes, require special handling. Facet data from the lend and FLSS APIs have different available properties, but both data sources are needed to prepare country facets for the UI.

## filterConfig

Central registry of available filters and their configurations. Each filter type defines how to convert between different formats (query params, GraphQL variables, UI display state).

## minMaxRange

Utilities for handling numeric range filters with minimum and maximum bounds.

