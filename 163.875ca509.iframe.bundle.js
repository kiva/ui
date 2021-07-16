(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[163],{

/***/ 5221:
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
        "fill": "#d20000",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffe600",
        "d": "M0 0h86.8L256 246.9 425.2 0H512L0 512h86.8L256 265.1 425.2 512H512zm512 204.8v102.4L0 204.8v102.4zM204.8 0L256 219.4 307.2 0zm0 512L256 292.6 307.2 512z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "256",
        "cy": "256",
        "r": "82.3",
        "fill": "#ffe600",
        "stroke": "#d20000",
        "stroke-width": "18.3"
      }
    })]));
  }

};

/***/ })

}]);