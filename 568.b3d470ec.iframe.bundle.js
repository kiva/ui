(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[568],{

/***/ 5895:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=template&id=1cee5e40&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"tw-py-8 md:tw-py-16"},[_c('div',{staticClass:"row align-center"},[_c('div',{staticClass:"small-12 medium-10 large-6 columns"},[(_vm.partnerImage.url)?_c('kv-contentful-img',{staticClass:"tw-block tw-w-full tw-mx-auto tw-mb-4 md:tw-mb-0",attrs:{"contentful-src":_vm.partnerImage.url,"width":500,"fallback-format":"jpg","loading":"lazy","alt":_vm.partnerImage.title}}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"small-10 large-6 columns"},[(_vm.headline)?_c('h2',{staticClass:"tw-mb-4"},[_vm._v("\n\t\t\t\t"+_vm._s(_vm.headline)+"\n\t\t\t")]):_vm._e(),_vm._v(" "),(_vm.bodyCopy)?_c('div',{ref:"partnerBodyCopy",staticClass:"tw-prose",domProps:{"innerHTML":_vm._s(_vm.bodyCopy)}}):_vm._e()])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=template&id=1cee5e40&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(8);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(14);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./src/util/contentful/richTextRenderer.js
var richTextRenderer = __webpack_require__(432);

// EXTERNAL MODULE: ./src/components/Kv/KvContentfulImg.vue + 4 modules
var KvContentfulImg = __webpack_require__(995);

// EXTERNAL MODULE: ./node_modules/@contentful/rich-text-html-renderer/dist/rich-text-html-renderer.es5.js
var rich_text_html_renderer_es5 = __webpack_require__(96);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=script&lang=js&


function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof_default()(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof_default()(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var CampaignPartnervue_type_script_lang_js_ = ({
  name: 'CampaignPartner',
  components: {
    KvContentfulImg: KvContentfulImg["a" /* default */]
  },
  props: {
    partnerAreaContent: {
      type: Object,
      default: function _default() {}
    },
    pageSettingData: {
      type: Object,
      default: function _default() {}
    }
  },
  computed: {
    partnerImage: function partnerImage() {
      var _this$partnerAreaCont, _mediaObject$file;
      var mediaObject = (_this$partnerAreaCont = this.partnerAreaContent) === null || _this$partnerAreaCont === void 0 || (_this$partnerAreaCont = _this$partnerAreaCont.media) === null || _this$partnerAreaCont === void 0 ? void 0 : _this$partnerAreaCont[0];
      return {
        title: (mediaObject === null || mediaObject === void 0 ? void 0 : mediaObject.title) || '',
        url: (mediaObject === null || mediaObject === void 0 || (_mediaObject$file = mediaObject.file) === null || _mediaObject$file === void 0 ? void 0 : _mediaObject$file.url) || ''
      };
    },
    headline: function headline() {
      var _this$partnerAreaCont2;
      return ((_this$partnerAreaCont2 = this.partnerAreaContent) === null || _this$partnerAreaCont2 === void 0 || (_this$partnerAreaCont2 = _this$partnerAreaCont2.contents) === null || _this$partnerAreaCont2 === void 0 || (_this$partnerAreaCont2 = _this$partnerAreaCont2[0]) === null || _this$partnerAreaCont2 === void 0 ? void 0 : _this$partnerAreaCont2.headline) || '';
    },
    bodyCopy: function bodyCopy() {
      var _this$partnerAreaCont3;
      var richText = (_this$partnerAreaCont3 = this.partnerAreaContent) === null || _this$partnerAreaCont3 === void 0 || (_this$partnerAreaCont3 = _this$partnerAreaCont3.contents) === null || _this$partnerAreaCont3 === void 0 || (_this$partnerAreaCont3 = _this$partnerAreaCont3[0]) === null || _this$partnerAreaCont3 === void 0 ? void 0 : _this$partnerAreaCont3.bodyCopy;
      return richText ? Object(rich_text_html_renderer_es5["documentToHtmlString"])(richText) : '';
    }
  },
  mounted: function mounted() {
    var _this = this;
    return asyncToGenerator_default()( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _this.$nextTick();
          case 2:
            Object(richTextRenderer["a" /* addBlankTargetToExternalLinks */])(_this.$refs.partnerBodyCopy, _this.pageSettingData);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }
});
// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=script&lang=js&
 /* harmony default export */ var CorporateCampaign_CampaignPartnervue_type_script_lang_js_ = (CampaignPartnervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  CorporateCampaign_CampaignPartnervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var CampaignPartner = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"CampaignPartner","exportName":"default","description":"","tags":{},"props":[{"name":"partnerAreaContent","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}},{"name":"pageSettingData","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);