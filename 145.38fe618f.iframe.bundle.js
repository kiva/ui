(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[145],{

/***/ 5203:
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
        "fill": "#ce1126",
        "d": "M0 0h1063v708.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#002868",
        "d": "M0 176h1063v356.6H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M684.2 354.3a152.7 152.7 0 11-305.4 0 152.7 152.7 0 01305.4 0z"
      }
    })])]));
  }

};

/***/ })

}]);