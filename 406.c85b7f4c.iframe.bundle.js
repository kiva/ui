(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[406],{

/***/ 5464:
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
        "d": "M0 0h640v480H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M-40 0h720v480H-40z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#002868",
        "d": "M-40 119.3h720v241.4H-40z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M423.4 240a103.4 103.4 0 11-206.8 0 103.4 103.4 0 11206.8 0z"
      }
    })])]));
  }

};

/***/ })

}]);