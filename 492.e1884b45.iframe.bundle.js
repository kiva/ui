(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[492],{

/***/ 5550:
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
    }, children.concat([_c('rect', {
      attrs: {
        "width": "640",
        "height": "160",
        "y": "160",
        "fill": "#fff",
        "fill-rule": "evenodd",
        "rx": "0",
        "ry": "0"
      }
    }), _c('rect', {
      attrs: {
        "width": "640",
        "height": "160",
        "y": "320",
        "fill-rule": "evenodd",
        "rx": "0",
        "ry": "0"
      }
    }), _c('path', {
      attrs: {
        "fill": "red",
        "fill-rule": "evenodd",
        "d": "M0 0h640v160H0z"
      }
    }), _c('path', {
      attrs: {
        "fill": "#090",
        "fill-rule": "evenodd",
        "d": "M201.9 281l-28.8-20.9-28.7 21.1 10.7-34.2-28.7-21.2 35.4-.3 11-34.1 11.3 34h35.4L191 246.9l10.9 34.2zm307.6 0l-28.8-20.9-28.7 21.1 10.7-34.2-28.6-21.2 35.4-.3 11-34.1 11.2 34h35.4l-28.5 21.4 11 34.2z"
      }
    })]));
  }

};

/***/ })

}]);