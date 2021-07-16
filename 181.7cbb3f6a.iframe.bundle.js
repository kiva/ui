(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[181],{

/***/ 5239:
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
        "fill": "#0db02b",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v341.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e05206",
        "d": "M0 0h512v170.7H0z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "256",
        "cy": "256",
        "r": "72.5",
        "fill": "#e05206"
      }
    })]));
  }

};

/***/ })

}]);