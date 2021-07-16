(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[303],{

/***/ 5361:
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
    }, children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M-12 0h640v480H-12z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(12)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M968.5 480h-979V1.8h979z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffe900",
        "d": "M968.5 344.5h-979V143.3h979z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#08ced6",
        "d": "M968.5 480h-979V320.6h979zm0-318.7h-979V2h979z"
      }
    }), _c('path', {
      attrs: {
        "d": "M-11 0c2.3 0 391.8 236.8 391.8 236.8L-12 479.2-10.9 0z"
      }
    })])]));
  }

};

/***/ })

}]);