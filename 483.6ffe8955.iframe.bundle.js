(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[483],{

/***/ 5541:
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
        "fill-rule": "evenodd"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0000cd",
        "d": "M0 320.3h640V480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 160.7h640v159.6H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00cd00",
        "d": "M0 0h640v160.7H0z"
      }
    })])]));
  }

};

/***/ })

}]);