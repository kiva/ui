(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[53],{

/***/ 5111:
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
        "fill": "#d52b1e",
        "d": "M0 0h512v512H0z"
      }
    }), _c('g', {
      attrs: {
        "fill": "#fff"
      }
    }, [_c('path', {
      attrs: {
        "d": "M96 208h320v96H96z"
      }
    }), _c('path', {
      attrs: {
        "d": "M208 96h96v320h-96z"
      }
    })])])]));
  }

};

/***/ })

}]);