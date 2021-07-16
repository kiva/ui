(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[395],{

/***/ 5453:
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
        "viewBox": "0 0 640 480"
      }, attrs),
      ...rest
    }, children.concat([_c('defs', [_c('path', {
      attrs: {
        "id": "a",
        "stroke-miterlimit": "10",
        "d": "M-28.6 47.5l1.8 1 46.7-81c2.7-.6 4.2-3.2 5.7-5.8 1-1.8 5-8.7 6.7-17.7a58 58 0 00-11.9 14.7c-1.5 2.6-3 5.2-2.3 7.9z"
      }
    })]), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M0 0h640v480H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 0h640v144H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#060",
        "d": "M0 336h640v144H0z"
      }
    }), _c('g', {
      attrs: {
        "id": "b",
        "transform": "matrix(3 0 0 3 320 240)"
      }
    }, [_c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "stroke": "#000",
        "xlink:href": "#a"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "fill": "#fff",
        "xlink:href": "#a"
      }
    })]), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "matrix(-1 0 0 1 640 0)",
        "xlink:href": "#b"
      }
    }), _c('path', {
      attrs: {
        "fill": "#b00",
        "d": "M640.5 168H377c-9-24-39-72-57-72s-48 48-57 72H-.2v144H263c9 24 39 72 57 72s48-48 57-72h263.5V168z"
      }
    }), _c('path', {
      attrs: {
        "id": "c",
        "d": "M377 312c9-24 15-48 15-72s-6-48-15-72c-9 24-15 48-15 72s6 48 15 72"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "matrix(-1 0 0 1 640 0)",
        "xlink:href": "#c"
      }
    }), _c('g', {
      attrs: {
        "fill": "#fff",
        "transform": "matrix(3 0 0 3 320 240)"
      }
    }, [_c('ellipse', {
      attrs: {
        "rx": "4",
        "ry": "6"
      }
    }), _c('path', {
      attrs: {
        "id": "d",
        "d": "M1 5.8s4 8 4 21-4 21-4 21z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(-1)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(-1 1)",
        "xlink:href": "#d"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(1 -1)",
        "xlink:href": "#d"
      }
    })])]));
  }

};

/***/ })

}]);