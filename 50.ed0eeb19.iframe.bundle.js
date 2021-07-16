(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[50],{

/***/ 5108:
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
        "fill": "#fff",
        "d": "M0-88h600v600H0z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "matrix(.853 0 0 .853 0 75.1)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#007fff",
        "d": "M0-88h800v600H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#f7d618",
        "d": "M36 32h84l26-84 26 84h84l-68 52 26 84-68-52-68 52 26-84-68-52zM750-88L0 362v150h50L800 62V-88h-50"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1021",
        "d": "M800-88L0 392v120L800 32V-88"
      }
    })])]));
  }

};

/***/ })

}]);