(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[509],{

/***/ 5567:
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
        "d": "M10 0h160v120H10z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "matrix(4 0 0 4 -40 0)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#09f",
        "d": "M0 0h180v120H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 0h180L0 120V0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 120h40l140-95V0h-40L0 95v25z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 91.5L137.2 0h13.5L0 100.5v-9zM29.3 120L180 19.5v9L42.8 120H29.3z"
      }
    })])]));
  }

};

/***/ })

}]);