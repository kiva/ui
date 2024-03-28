(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ 5733:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(370);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(371);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1416);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1417);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(919);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flag_icon_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(376);
/* harmony import */ var flag_icon_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flag_icon_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_globekit_globekit_esm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5287);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }


 // Copied from KvFlag

var COUNTRY_LIST = Object(flag_icon_css__WEBPACK_IMPORTED_MODULE_5__["getCodes"])();
var SPRITE_FLAG_WIDTH = 32; // Number of px wide that the sprite PNG is.

var getFlagSpriteYPosition = function getFlagSpriteYPosition(countryCode) {
  // Determine what percentage down the flag is in the sprite
  // depending on its position in the country list.
  var countryIndex = COUNTRY_LIST.indexOf(countryCode.toUpperCase());
  var flagHeightInSprite = SPRITE_FLAG_WIDTH;
  var totalSpriteHeight = flagHeightInSprite * (COUNTRY_LIST.length - 1);
  return countryIndex * flagHeightInSprite / totalSpriteHeight * 100;
}; // End Copied from KvFlag


var PinCallout = /*#__PURE__*/function (_Callout) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(PinCallout, _Callout);

  var _super = _createSuper(PinCallout);

  function PinCallout() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, PinCallout);

    return _super.apply(this, arguments);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(PinCallout, [{
    key: "createElement",
    value: function createElement() {
      var div = document.createElement('div');
      div.innerHTML = "<div\n\t\t\tclass=\"pin-callout-flag\"\n\t\t\tstyle=\"background-position-y: ".concat(getFlagSpriteYPosition(this.definition.data.iso2), "%\">\n\t\t</div>");
      div.className = 'callout pin-callout hidden';
      div.dataset.code = this.definition.data.iso3;
      return div;
    }
  }, {
    key: "setPosition",
    value: function setPosition(position) {
      var nx = position.screen.x - (this.size.left + this.size.right) / 2;
      var ny = position.screen.y - (this.size.top + this.size.bottom) * (66 / 74);
      this.element.style.transform = "translate(".concat(nx, "px, ").concat(ny, "px)"); // this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);

      this.element.style.zIndex = 10000;
      this.element.classList.remove('hidden');
    }
  }, {
    key: "animateIn",
    value: function animateIn() {
      var _this = this;

      requestAnimationFrame(function () {
        _this.element.classList.add('animate-in');

        setTimeout(function () {
          _this.element.classList.remove('animate-in');
        }, 500);
      });
    }
  }, {
    key: "animateOut",
    value: function animateOut(onComplete) {
      var _this2 = this;

      this.element.classList.add('animate-out');
      setTimeout(function () {
        onComplete(_this2);
      }, 200);
    }
  }]);

  return PinCallout;
}(_lib_globekit_globekit_esm__WEBPACK_IMPORTED_MODULE_6__["Callout"]);

/* harmony default export */ __webpack_exports__["default"] = (PinCallout);

/***/ })

}]);