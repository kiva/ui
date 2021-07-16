(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[248],{

/***/ 5306:
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
        "fill-opacity": ".7",
        "d": "M102.9 0h496v496H103z"
      }
    })])]), _c('g', {
      attrs: {
        "clip-path": "url(#a)",
        "transform": "translate(-106.2) scale(1.0321)"
      }
    }, [_c('g', {
      attrs: {
        "fill-rule": "evenodd",
        "stroke-width": "1pt"
      }
    }, [_c('path', {
      attrs: {
        "fill": "#09f",
        "d": "M0 0h744.1v496H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "d": "M0 0h744.1L0 496V0z"
      }
    }), _c('path', {
      attrs: {
        "d": "M0 496h165.4L744 103.4V0H578.7L0 392.7v103.4z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#ff0",
        "d": "M0 378L567 0h56L0 415.3v-37.2zm121.1 118l623-415.3V118L177 496h-55.9z"
      }
    })])])]));
  }

};

/***/ })

}]);