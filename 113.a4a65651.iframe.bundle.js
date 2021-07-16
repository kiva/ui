(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[113],{

/***/ 5171:
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
        "d": "M237.1 0h493.5v493.5H237.1z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "translate(-246) scale(1.0375)"
      }
    }, [_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "d": "M0 0h987v164.5H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 164.5h987V329H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 329h987v164.5H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M0 493.5l493.5-246.8L0 0v493.5z"
      }
    })])])]));
  }

};

/***/ })

}]);