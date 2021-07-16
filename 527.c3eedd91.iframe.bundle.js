(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[527],{

/***/ 5585:
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
    }, children.concat([_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h640v472.8H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#f10600",
        "d": "M0 0h640v157.4H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 322.6h640V480H0z"
      }
    })])]));
  }

};

/***/ })

}]);