(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[131],{

/***/ 5189:
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
        "d": "M0 0l256 256L0 512zm512 0L256 256l256 256z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 0l256 256L512 0zm0 512l256-256 256 256z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fc0",
        "d": "M512 0h-47.7L0 464.3V512h47.7L512 47.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fc0",
        "d": "M0 0v47.7L464.3 512H512v-47.7L47.7 0z"
      }
    })])]));
  }

};

/***/ })

}]);