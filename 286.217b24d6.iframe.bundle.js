(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[286],{

/***/ 5344:
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
        "d": "M106.3 0h1133.3v850H106.3z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "matrix(.56472 0 0 .56482 -60 -.1)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#0053a5",
        "d": "M0 0h1300v850H0z"
      }
    }), _c('g', {
      attrs: {
        "fill": "#ffce00"
      }
    }, [_c('path', {
      attrs: {
        "d": "M400 0h250v850H400z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 300h1300v250H0z"
      }
    })]), _c('g', {
      attrs: {
        "fill": "#d21034"
      }
    }, [_c('path', {
      attrs: {
        "d": "M475 0h100v850H475z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 375h1300v100H0z"
      }
    })])])]));
  }

};

/***/ })

}]);