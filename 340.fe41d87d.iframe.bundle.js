(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[340],{

/***/ 5398:
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
        "fill": "#fcdd09",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "stroke": "#da121a",
        "stroke-width": "60",
        "d": "M0 90h810m0 120H0m0 120h810m0 120H0",
        "transform": "scale(.79012 .88889)"
      }
    })]));
  }

};

/***/ })

}]);