(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[69],{

/***/ 5127:
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
        "d": "M55.4 0H764v708.7H55.4z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "clip-path": "url(#a)",
        "transform": "translate(-40) scale(.722)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0c0",
        "d": "M0 0h1063v708.7H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#69f",
        "d": "M0 0h1063v354.3H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fffefe",
        "d": "M0 0l529.7 353.9L0 707.3V0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "d": "M221.2 404.3l-42.7-30.8-42.4 31 15.8-50.3-42.4-31.2 52.4-.4 16.3-50.2 16.6 50 52.4.2-42.1 31.4 16 50.3z"
      }
    })])]));
  }

};

/***/ })

}]);