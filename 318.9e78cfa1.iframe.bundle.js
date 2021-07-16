(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[318],{

/***/ 5376:
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
        "fill": "#007a5e",
        "d": "M0 0h213.3v480H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ce1126",
        "d": "M213.3 0h213.4v480H213.3z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fcd116",
        "d": "M426.7 0H640v480H426.7z"
      }
    }), _c('g', {
      attrs: {
        "fill": "#fcd116",
        "transform": "translate(320 240) scale(7.1111)"
      }
    }, [_c('g', {
      attrs: {
        "id": "b"
      }
    }, [_c('path', {
      attrs: {
        "id": "a",
        "d": "M0-8L-2.5-.4 1.3.9z"
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
        "transform": "rotate(72)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(144)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-144)",
        "xlink:href": "#b"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "rotate(-72)",
        "xlink:href": "#b"
      }
    })])]));
  }

};

/***/ })

}]);