(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[349],{

/***/ 5407:
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
        "d": "M-78 32h640v480H-78z"
      }
    })])]), _c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "0",
        "clip-path": "url(#a)",
        "transform": "translate(78 -32)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M-78 32h663.9v480H-78z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#003897",
        "d": "M-76 218.7h185.9V32H216v186.7h371.8v106.6H216V512H109.9V325.3h-186V218.7z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#d72828",
        "d": "M-76 245.3h212.4V32h53.1v213.3H588v53.4H189.5V512h-53V298.7H-76v-53.4z"
      }
    })])]));
  }

};

/***/ })

}]);