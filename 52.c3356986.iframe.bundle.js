(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[52],{

/***/ 5110:
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
        "d": "M115.7 0h496.1v496h-496z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt",
        "clip-path": "url(#a)",
        "transform": "translate(-119.5) scale(1.032)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 0h744v496H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00ca00",
        "d": "M0 0v496L496 0H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M248 496h496V0L248 496z"
      }
    })])]));
  }

};

/***/ })

}]);