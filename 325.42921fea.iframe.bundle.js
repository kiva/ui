(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[325],{

/***/ 5383:
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
    }, children.concat([_c('defs', [_c('clipPath', {
      attrs: {
        "id": "a"
      }
    }, [_c('path', {
      attrs: {
        "fill-opacity": ".7",
        "d": "M0 0h682.7v512H0z"
      }
    })]), _c('path', {
      attrs: {
        "id": "b",
        "d": "M0-1l.2.7H1L.3 0l.2.7L0 .4l-.6.4.2-.7-.5-.4h.7z"
      }
    })]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "scale(.94)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#002b7f",
        "d": "M0 0h768v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#f9e814",
        "d": "M0 320h768v64H0z"
      }
    }), _c('use', {
      attrs: {
        "width": "13500",
        "height": "9000",
        "x": "2",
        "y": "2",
        "fill": "#fff",
        "transform": "scale(42.67)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "13500",
        "height": "9000",
        "x": "3",
        "y": "3",
        "fill": "#fff",
        "transform": "scale(56.9)",
        "xlink:href": "#b"
      }
    })])]));
  }

};

/***/ })

}]);