(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[29],{

/***/ 5087:
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
        "fill": "#006a4e",
        "d": "M0 0h512v512H0z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "230",
        "cy": "256",
        "r": "170.7",
        "fill": "#f42a41"
      }
    })]));
  }

};

/***/ })

}]);