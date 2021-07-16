(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[211],{

/***/ 5269:
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
        "fill": "#20603d",
        "d": "M0 0h512v512H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fad201",
        "d": "M0 0h512v384H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#00a1de",
        "d": "M0 0h512v256H0z"
      }
    }), _c('g', {
      attrs: {
        "transform": "translate(374.4 133.8) scale(.7111)"
      }
    }, [_c('g', {
      attrs: {
        "id": "b"
      }
    }, [_c('path', {
      attrs: {
        "id": "a",
        "fill": "#e5be01",
        "d": "M116.1 0L35.7 4.7l76.4 25.4-78.8-16.3L100.6 58l-72-36.2L82 82.1 21.9 28.6l36.2 72-44.3-67.3L30 112 4.7 35.7 0 116.1-1-1z"
      }
    }), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(1 -1)",
        "xlink:href": "#a"
      }
    })]), _c('use', {
      attrs: {
        "width": "100%",
        "height": "100%",
        "transform": "scale(-1 1)",
        "xlink:href": "#b"
      }
    }), _c('circle', {
      attrs: {
        "r": "34.3",
        "fill": "#e5be01",
        "stroke": "#00a1de",
        "stroke-width": "3.4"
      }
    })])]));
  }

};

/***/ })

}]);