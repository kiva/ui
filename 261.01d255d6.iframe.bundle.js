(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[261],{

/***/ 5319:
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
        "fill": "#ec0015",
        "d": "M0 0h1063v708.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M661 527.5l-124-92.6-123.3 93.5 45.9-152-123.2-93.8 152.4-1.3L536 129.8 584.3 281l152.4.2-122.5 94.7L661 527.5z"
      }
    })])]));
  }

};

/***/ })

}]);