(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[417],{

/***/ 5475:
/***/ (function(module, exports) {

module.exports = {
  functional: true,

  render(_h, _vm) {
    const {
      _c,
      _v,
      data,
      children = []
    } = _vm;
    const {
      class: classNames,
      staticClass,
      style,
      staticStyle,
      attrs = {},
      ...rest
    } = data;
    return _c('svg', {
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 640 480"
      }, attrs),
      ...rest
    }, children.concat([_c('path', {
      attrs: {
        "fill": "#c1272d",
        "d": "M640 0H0v480h640z"
      }
    }), _c('path', {
      attrs: {
        "fill": "none",
        "stroke": "#006233",
        "stroke-width": "11.7",
        "d": "M320 179.4L284.4 289l93.2-67.6H262.4l93.2 67.6z"
      }
    })]));
  }

};

/***/ })

}]);