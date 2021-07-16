(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[185],{

/***/ 5243:
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
        "fill": "#21468b",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v341.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ae1c28",
        "d": "M0 0h512v170.7H0z"
      }
    })]));
  }

};

/***/ })

}]);