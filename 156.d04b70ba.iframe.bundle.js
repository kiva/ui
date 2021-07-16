(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[156],{

/***/ 5214:
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
        "viewBox": "0 0 512 512"
      }, attrs),
      ...rest
    }, children.concat([_c('path', {
      attrs: {
        "fill": "#c1272d",
        "d": "M512 0H0v512h512z"
      }
    }), _c('path', {
      attrs: {
        "fill": "none",
        "stroke": "#006233",
        "stroke-width": "12.5",
        "d": "M256 191.4l-38 116.8 99.4-72.2H194.6l99.3 72.2z"
      }
    })]));
  }

};

/***/ })

}]);