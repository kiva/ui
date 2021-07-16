(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[331],{

/***/ 5389:
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
        "fill": "#c8102e",
        "d": "M0 0h640.1v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M205.7 0h68.6v480h-68.6z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 205.7h640.1v68.6H0z"
      }
    })]));
  }

};

/***/ })

}]);