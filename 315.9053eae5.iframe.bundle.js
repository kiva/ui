(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[315],{

/***/ 5373:
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
        "fill": "#00cd00",
        "d": "M426.8 0H640v480H426.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff9a00",
        "d": "M0 0h212.9v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M212.9 0h214v480h-214z"
      }
    })])]));
  }

};

/***/ })

}]);