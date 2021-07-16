(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[323],{

/***/ 5381:
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
        "d": "M-32 0h682.7v512H-32z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(30) scale(.94)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0050f0",
        "d": "M-32 0h768v512H-32z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-32 102.4h768v102.4H-32zm0 204.8h768v102.4H-32z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ed0000",
        "d": "M-32 0l440.7 255.7L-32 511V0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M161.8 325.5L114.3 290l-47.2 35.8 17.6-58.1-47.2-36 58.3-.4 18.1-58 18.5 57.8 58.3.1-46.9 36.3 18 58z"
      }
    })])]));
  }

};

/***/ })

}]);