(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[354],{

/***/ 5412:
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
        "fill": "#0065bd",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "stroke": "#fff",
        "stroke-width": ".6",
        "d": "M0 0l5 3M0 3l5-3",
        "transform": "scale(128 160)"
      }
    })]));
  }

};

/***/ })

}]);