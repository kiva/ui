(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[100],{

/***/ 5158:
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
        "fill": "#006b3f",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M0 0h512v341.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h512v170.7H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M256 170.7l55.5 170.6L166.3 236h179.4L200.6 341.3z"
      }
    })]));
  }

};

/***/ })

}]);