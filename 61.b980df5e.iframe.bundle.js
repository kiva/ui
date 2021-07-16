(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[61],{

/***/ 5119:
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
        "fill": "#fff",
        "d": "M0 0h512v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d7141a",
        "d": "M0 256h512v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#11457e",
        "d": "M300 256L0 56v400z"
      }
    })]));
  }

};

/***/ })

}]);