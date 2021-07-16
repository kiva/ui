(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[155],{

/***/ 5213:
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
        "d": "M250 12h500v500H250z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "translate(-256 -12.3) scale(1.024)"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#239e46",
        "d": "M0 12h1000v500H0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 12h1000v375H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#e70013",
        "d": "M0 12h1000v125H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#fff",
        "d": "M544.2 217.8a54.3 54.3 0 100 88.4 62.5 62.5 0 110-88.4M530.4 262l84.1-27.3-52 71.5v-88.4l52 71.5z"
      }
    })])]));
  }

};

/***/ })

}]);