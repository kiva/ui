(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[161],{

/***/ 5219:
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
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ff3319",
        "d": "M170.7 0H512v256H170.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00cc28",
        "d": "M170.7 256H512v256H170.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h170.7v512H0z"
      }
    })])]));
  }

};

/***/ })

}]);