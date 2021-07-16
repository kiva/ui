(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[99],{

/***/ 5157:
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
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 512 512"
      }, attrs),
      ...rest
    }, children.concat([_c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e8112d",
        "d": "M192 0h128v512H192z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e8112d",
        "d": "M0 187.7h512v136.6H0z"
      }
    }), _c('path', {
      attrs: {
        "id": "a",
        "fill": "#f9dd16",
        "d": "M46 305.8l23.3-25h210v-49.7h-210L46 206.2z"
      }
    }), _c('use', {
      attrs: {
        "width": "36",
        "height": "24",
        "transform": "matrix(0 1.06667 -.9375 0 496 -17)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "36",
        "height": "24",
        "transform": "matrix(0 -1.06667 .9375 0 16 529)",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "36",
        "height": "24",
        "transform": "rotate(180 256 256)",
        "xlink:href": "#a"
      }
    })]));
  }

};

/***/ })

}]);