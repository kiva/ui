(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[352],{

/***/ 5410:
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
        "fill": "#fff",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1124",
        "d": "M281.6 0h76.8v480h-76.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1124",
        "d": "M0 201.6h640v76.8H0z"
      }
    })]));
  }

};

/***/ })

}]);