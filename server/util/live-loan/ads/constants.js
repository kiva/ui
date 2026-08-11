// The public prod host for the ad Final URL (the lend link Google serves to real lenders). Deliberately
// hardcoded and NOT derived from config.app.host / BASE_URL: Google serves this URL to real lenders, so
// it must always point at the live prod site even when the feed is generated in a non-prod environment.
export const KIVA_PROD_HOST = 'https://www.kiva.org';

// Ad images are delivered by Cloudinary, which fetches the loan's stored original through Kiva's
// pre-configured `remote/` mapping and transforms it on the fly. The transform pins JPEG (f_jpg — never
// f_auto, since Google Ads allows only PNG/JPG/GIF and f_auto can deliver webp), converts to sRGB, and
// force-embeds an sRGB ICC profile (fl_force_icc): Google's image spec calls for JPG ads in RGB with an
// embedded ICC profile, and Kiva's originals are RGB but untagged. c_limit,w_1200,h_1200 bounds the
// longest edge to 1200px without upscaling smaller sources.
export const CLOUDINARY_AD_IMAGE_BASE = 'https://res.cloudinary.com/kiva';
export const CLOUDINARY_AD_IMAGE_TRANSFORM = 'c_limit,w_1200,h_1200,f_jpg,cs_srgb,fl_force_icc';
