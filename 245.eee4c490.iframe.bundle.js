(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[245],{

/***/ 5303:
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
      staticStyle: {
        "width": "0"
      },
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v512H0z"
      }
    }), _c('g', {
      attrs: {
        "fill-rule": "evenodd"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#e00000",
        "d": "M371 512L0 1v510.7l371 .3zM141 0l371 511V.2L141 0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M22.2.2h94.9l374.5 511.3h-97.9L22.2.2z"
      }
    })])]));
  }

};

/***/ })

}]);