(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ 5080:
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
    }, children.concat([_c('g', {
      attrs: {
        "fill-rule": "evenodd"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M512 512H0V0h512z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ed2939",
        "d": "M512 512H0V341.3h512zm0-341.2H0V.1h512z"
      }
    })])]));
  }

};

/***/ })

}]);