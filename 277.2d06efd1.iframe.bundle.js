(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[277],{

/***/ 5335:
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
        "fill": "red",
        "d": "M0 0h640v160H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00f",
        "d": "M0 160h640v160H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "orange",
        "d": "M0 320h640v160H0z"
      }
    })]));
  }

};

/***/ })

}]);