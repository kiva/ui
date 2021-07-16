(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ 5100:
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
        "d": "M56.6 26.4H537v480.3H56.6z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "matrix(1.066 0 0 1.067 -60.4 -28.1)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M990 506.2H9.4V27.6H990z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ffe900",
        "d": "M990 370.6H9.4V169.2H990z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#08ced6",
        "d": "M990 506.2H9.4V346.7H990zm0-319H9.4V27.9H990z"
      }
    }), _c('path', {
      attrs: {
        "d": "M9 25.9c2.1 0 392.3 237 392.3 237L7.8 505.3 9 25.9z"
      }
    })])]));
  }

};

/***/ })

}]);