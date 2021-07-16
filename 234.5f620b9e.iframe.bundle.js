(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[234],{

/***/ 5292:
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
        "fill": "#000067",
        "d": "M0 0h171.2v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M340.8 0H512v512H340.8z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M171.2 0h169.6v512H171.2z"
      }
    })])]));
  }

};

/***/ })

}]);