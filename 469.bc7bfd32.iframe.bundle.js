(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[469],{

/***/ 5527:
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
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#00319c",
        "d": "M0 0h213.3v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffde00",
        "d": "M213.3 0h213.4v480H213.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#de2110",
        "d": "M426.7 0H640v480H426.7z"
      }
    })])]));
  }

};

/***/ })

}]);