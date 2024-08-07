(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[562],{

/***/ 5875:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(408);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(409);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1489);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(978);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1490);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_globekit_globekit_esm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5433);





function _callSuper(t, o, e) { return o = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(o), _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var DotCallout = /*#__PURE__*/function (_Callout) {
  function DotCallout() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, DotCallout);
    return _callSuper(this, DotCallout, arguments);
  }
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(DotCallout, _Callout);
  return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(DotCallout, [{
    key: "createElement",
    value: function createElement() {
      this.firstRun = true;
      var div = document.createElement('div');
      div.className = 'callout dot-callout hidden';
      div.dataset.code = this.definition.data.iso3;
      return div;
    }
  }, {
    key: "setPosition",
    value: function setPosition(position) {
      var _this = this;
      var nx = position.screen.x - (this.size.left + this.size.right) / 2;
      var ny = position.screen.y - (this.size.left + this.size.right) / 2;
      this.element.style.transform = "translate(".concat(nx, "px, ").concat(ny, "px)");
      this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
      if (position.world.similarityToCameraVector < 0.75) {
        var scale = Math.max((position.world.similarityToCameraVector - 0.5) / (0.75 - 0.5), 0);
        this.element.style.transform += " scale(".concat(scale, ", ").concat(scale, ")");
      }
      if (this.firstRun) {
        setTimeout(function () {
          _this.element.className = 'callout dot-callout';
        }, 50);
        this.firstRun = false;
      }
    }
  }]);
}(_lib_globekit_globekit_esm__WEBPACK_IMPORTED_MODULE_5__["Callout"]);
/* harmony default export */ __webpack_exports__["default"] = (DotCallout);

/***/ })

}]);