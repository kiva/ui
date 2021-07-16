(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[317],{

/***/ 5375:
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
        "d": "M0 0h682.7v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "scale(.9375)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M256 0h512v256H256z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#0039a6",
        "d": "M0 0h256v256H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M167.8 191.7L128.2 162l-39.5 30 14.7-48.8L64 113.1l48.7-.5L127.8 64l15.5 48.5 48.7.1-39.2 30.4 15 48.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d52b1e",
        "d": "M0 256h768v256H0z"
      }
    })])]));
  }

};

/***/ })

}]);