(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[222],{

/***/ 5280:
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
    }, [_c('rect', {
      attrs: {
        "width": "384",
        "height": "512",
        "rx": "4.6",
        "ry": "7.6"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "scale(1.33333 1)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0000cd",
        "d": "M0 341.7h512V512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 171.4h512v170.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00cd00",
        "d": "M0 0h512v171.4H0z"
      }
    })])]));
  }

};

/***/ })

}]);