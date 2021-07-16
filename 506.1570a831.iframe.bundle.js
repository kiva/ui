(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[506],{

/***/ 5564:
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
        "fill": "#fff",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e00000",
        "fill-rule": "evenodd",
        "d": "M463.7 480L0 1v478.8l463.7.2zM176.3 0L640 479V.2L176.3 0z"
      }
    }), _c('path', {
      attrs: {
        "fill-rule": "evenodd",
        "d": "M27.7.2h118.6l468.2 479.3H492.2L27.7.2z"
      }
    })]));
  }

};

/***/ })

}]);