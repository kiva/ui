(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[111],{

/***/ 5169:
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
        "fill": "#ce1126",
        "d": "M0 0h160v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M160 0h352v256H160z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#009e49",
        "d": "M160 256h352v256H160z"
      }
    }), _c('g', {
      attrs: {
        "transform": "translate(-46.2 72.8) scale(.7886)"
      }
    }, [_c('g', {
      attrs: {
        "id": "b",
        "transform": "matrix(80 0 0 80 160 240)"
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
        "transform": "rotate(72 160 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(144 160 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-144 160 240)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-72 160 240)",
        "xlink:href": "#b"
      }
    })])]));
  }

};

/***/ })

}]);