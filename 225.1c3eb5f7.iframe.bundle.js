(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[225],{

/***/ 5283:
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
        "d": "M177.2 0h708.6v708.7H177.2z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(-128) scale(.72249)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#40a6ff",
        "d": "M0 0h1063v708.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M643 527.6l-114.3-74-113.6 74.8 42.3-121.5-113.5-75 140.4-1 43.5-121.1 44.5 120.8 140.3.1-112.9 75.7L643 527.6z"
      }
    })])]));
  }

};

/***/ })

}]);