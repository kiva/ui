(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[128],{

/***/ 5186:
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
    }, children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M85.4 0h486v486h-486z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "0",
        "clip-path": "url(#a)",
        "transform": "translate(-90) scale(1.0535)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#003897",
        "d": "M0 0h675v486H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 189h189V0h108v189h378v108H297v189H189V297H0V189z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d72828",
        "d": "M0 216h216V0h54v216h405v54H270v216h-54V270H0v-54z"
      }
    })])]));
  }

};

/***/ })

}]);