(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 3026:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(3);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(1300));

var _createClass2 = _interopRequireDefault(__webpack_require__(1301));

var _inherits2 = _interopRequireDefault(__webpack_require__(5597));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(5598));

var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(5600));

var _globekit = __webpack_require__(3015);

var _flagIconCss = __webpack_require__(569);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Copied from KvFlag
var COUNTRY_LIST = (0, _flagIconCss.getCodes)();
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
  (0, _inherits2.default)(PinCallout, _Callout);

  var _super = _createSuper(PinCallout);

  function PinCallout() {
    (0, _classCallCheck2.default)(this, PinCallout);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(PinCallout, [{
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
}(_globekit.Callout);

var _default = PinCallout;
exports.default = _default;

/***/ }),

/***/ 5597:
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(3016);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 5598:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(284)["default"];

var assertThisInitialized = __webpack_require__(5599);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 5599:
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 5600:
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ })

}]);