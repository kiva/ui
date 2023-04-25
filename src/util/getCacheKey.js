// Return a cache key that includes the current commit hash
// eslint-disable-next-line no-undef
export default key => `${key}-${(UI_COMMIT || '').substring(0, 8)}`;
