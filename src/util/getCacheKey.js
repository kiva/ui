// eslint-disable-next-line no-undef
const commitHash = () => (UI_COMMIT || '').substring(0, 8);
const timestamp = () => Date.now().toString();
const isProd = process.env.NODE_ENV === 'production';

// Return a cache key that includes the current commit hash, with the timestamp added in development
export default key => `${key}-${commitHash()}${isProd ? '' : timestamp()}`;
