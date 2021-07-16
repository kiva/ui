(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[435],{

/***/ 5493:
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
        "fill": "#d21034",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#007e3a",
        "d": "M120 120h400v240H120z"
      }
    }), _c('circle', {
      attrs: {
        "cx": "350",
        "cy": "240",
        "r": "80",
        "fill": "#fff"
      }
    }), _c('circle', {
      attrs: {
        "cx": "380",
        "cy": "240",
        "r": "80",
        "fill": "#007e3a"
      }
    })]));
  }

};

/***/ })

}]);