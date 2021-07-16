(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[174],{

/***/ 5232:
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
        "fill": "#d21034",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#007e3a",
        "d": "M128 128h256v256H128z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "288",
        "cy": "256",
        "r": "85.3",
        "fill": "#fff"
      }
    }), _c('ellipse', {
      attrs: {
        "cx": "308.6",
        "cy": "256",
        "fill": "#007e3a",
        "rx": "73.9",
        "ry": "85.3"
      }
    })]));
  }

};

/***/ })

}]);