(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[51],{

/***/ 5109:
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
        "d": "M0 0h512v512H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#00f",
        "d": "M-52-.5h768v127H-52z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M-52 383.5h768V512H-52z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009a00",
        "d": "M-52 255h768v128.5H-52z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-52 126.5h768V255H-52z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M268 0h128v512H268z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M109.5 112.3L75.9 89.1l-33.4 23.4 11.6-39.2-32.5-24.6 40.7-1L75.7 8.8l13.5 38.6 40.8.8L97.6 73"
      }
    })])]));
  }

};

/***/ })

}]);