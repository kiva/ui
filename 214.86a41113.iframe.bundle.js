(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[214],{

/***/ 5272:
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
        "d": "M0 0h512v496H0z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "scale(1 1.0321)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "red",
        "d": "M0 0h992.1v496H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 496l992.1-165.3v165.4H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 496l992.1-330.6v165.3L0 496.1z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009",
        "d": "M0 496V0h330.7L0 496z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 496L330.7 0h330.7L0 496z"
      }
    })])]));
  }

};

/***/ })

}]);