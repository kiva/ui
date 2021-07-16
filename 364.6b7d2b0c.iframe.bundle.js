(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[364],{

/***/ 5422:
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
        "d": "M0-48h640v480H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(0 48)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "red",
        "d": "M0-128h640V85.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 85.3h640V121H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009",
        "d": "M0 120.9h640V263H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 263.1h640v35.6H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 298.7h640V512H0z"
      }
    })])]));
  }

};

/***/ })

}]);