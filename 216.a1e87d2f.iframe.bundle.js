(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[216],{

/***/ 5274:
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
        "fill": "#066aa7",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fecc00",
        "d": "M0 204.8h512v102.4H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fecc00",
        "d": "M134 0h102.4v512H134z"
      }
    })]));
  }

};

/***/ })

}]);