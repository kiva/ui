import svgXhr from 'webpack-svgstore-plugin/src/helpers/svgxhr';

// inject svg icons as a sprite sheet
// eslint-disable-next-line no-underscore-dangle
const __svgsprite__ = { path: './icons/sprite/*.svg', name: './static/icons.[hash].svg' };
svgXhr(__svgsprite__);
