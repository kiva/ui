(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[204],{

/***/ 5262:
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
        "d": "M61.7 4.2h170.8V175H61.7z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(-185 -12.5) scale(2.9973)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#4aadd6",
        "d": "M0 4.2h301.2V175H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffde00",
        "d": "M185.9 86.8a52 52 0 01-53 50.8 52 52 0 01-53.2-50.8c0-28 23.8-50.8 53.1-50.8s53 22.7 53 50.8z"
      }
    })])]));
  }

};

/***/ })

}]);