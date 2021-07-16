(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[372],{

/***/ 5430:
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
    }, children.concat([_c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M0 0h220v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M220 0h420v240H220z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009e49",
        "d": "M220 240h420v240H220z"
      }
    }), _c('g', {
      attrs: {
        "id": "b",
        "transform": "matrix(80 0 0 80 110 240)"
      }
    }, [_c('path', {
      attrs: {
        "id": "a",
        "d": "M0-1v1h.5",
        "transform": "rotate(18 0 -1)"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(-1 1)",
        "xlink:href": "#a"
      }
    })]), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(72 110 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(144 110 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-144 110 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-72 110 240)",
        "xlink:href": "#b"
      }
    })]));
  }

};

/***/ })

}]);