(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[361],{

/***/ 5419:
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
        "fill": "#006b3f",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M0 0h640v320H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h640v160H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M320 160l52 160-136.1-98.9H404L268 320z"
      }
    })]));
  }

};

/***/ })

}]);