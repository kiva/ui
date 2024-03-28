(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ 4947:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    categoryRowArrowsVisible: function categoryRowArrowsVisible() {
      /*
      We are using the lack of CSS hover support to gate the visibility of the arrows
      */
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return true;
      }

      var rightArrow = document.querySelector('.arrow.right-arrow');

      if (!rightArrow) {
        return true;
      }

      return window.getComputedStyle(rightArrow).display !== 'none';
    }
  }
});

/***/ }),

/***/ 5298:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5582);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("266ed08c", content, true, {});

/***/ }),

/***/ 5299:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5584);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("6d8fb18b", content, true, {});

/***/ }),

/***/ 5300:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5586);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("ecc7a7ea", content, true, {});

/***/ }),

/***/ 5581:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardSmall_vue_vue_type_style_index_0_id_4b9d466c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5298);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardSmall_vue_vue_type_style_index_0_id_4b9d466c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardSmall_vue_vue_type_style_index_0_id_4b9d466c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5582:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".base-portrait-hover-loan-card[data-v-4b9d466c],.hover-loan-card-small[data-v-4b9d466c]{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-pack:justify;-ms-flex-pack:justify;-ms-flex-negative:0;border-radius:.1875rem;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;flex-shrink:0;justify-content:space-between;opacity:1;pointer-events:auto;-webkit-transform:scale(1);transform:scale(1)}.base-portrait-hover-loan-card-image[data-v-4b9d466c],.hover-loan-card-small .hover-loan-card-image[data-v-4b9d466c]{-ms-flex-negative:0;border-radius:.1875rem .1875rem 0 0;flex-shrink:0;overflow:hidden;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:top center;transform-origin:top center;-webkit-transition:-webkit-transform .15s linear;transition:-webkit-transform .15s linear;transition:transform .15s linear;transition:transform .15s linear,-webkit-transform .15s linear}.base-portrait-hover-loan-card-data-wrap[data-v-4b9d466c],.hover-loan-card-small .hover-loan-card-data-wrap[data-v-4b9d466c]{border:.0625rem solid #d8d8d8;border-radius:0 0 .1875rem .1875rem;border-top:none}.hover-loan-card-small[data-v-4b9d466c]{height:14.25rem;-webkit-transition:-webkit-transform .15s linear;transition:-webkit-transform .15s linear;transition:transform .15s linear;transition:transform .15s linear,-webkit-transform .15s linear;width:13.75rem}.hover-loan-card-small .hover-loan-card-image[data-v-4b9d466c]{height:8.59375rem}.hover-loan-card-small .hover-loan-card-data-wrap[data-v-4b9d466c]{height:5.65625rem;padding:.75rem 1rem;text-align:center}.hover-loan-card-small .hover-loan-card-data-wrap .name[data-v-4b9d466c]{margin-bottom:.75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hover-loan-card-small .hover-loan-card-data-wrap .minimal-fundraising-meter[data-v-4b9d466c]{margin-bottom:.875rem}.hover-loan-card-small .hover-loan-card-data-wrap .loan-data[data-v-4b9d466c]{margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hover-loan-card-small.expanded[data-v-4b9d466c]{pointer-events:none;-webkit-transform:scale(1.4545454545,1.7675438596);transform:scale(1.4545454545,1.7675438596)}.hover-loan-card-small.expanded .hover-loan-card-image[data-v-4b9d466c]{-webkit-transform:scaleY(.8229190165);transform:scaleY(.8229190165)}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5583:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardLarge_vue_vue_type_style_index_0_id_5bafb02c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5299);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardLarge_vue_vue_type_style_index_0_id_5bafb02c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCardLarge_vue_vue_type_style_index_0_id_5bafb02c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5584:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".base-portrait-hover-loan-card[data-v-5bafb02c],.hover-loan-card-large[data-v-5bafb02c]{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-pack:justify;-ms-flex-pack:justify;-ms-flex-negative:0;border-radius:.1875rem;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;flex-shrink:0;justify-content:space-between;opacity:1;pointer-events:auto;-webkit-transform:scale(1);transform:scale(1)}.base-portrait-hover-loan-card-image[data-v-5bafb02c],.hover-loan-card-large .hover-loan-card-image[data-v-5bafb02c]{-ms-flex-negative:0;border-radius:.1875rem .1875rem 0 0;flex-shrink:0;overflow:hidden;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:top center;transform-origin:top center;-webkit-transition:-webkit-transform .15s linear;transition:-webkit-transform .15s linear;transition:transform .15s linear;transition:transform .15s linear,-webkit-transform .15s linear}.base-portrait-hover-loan-card-data-wrap[data-v-5bafb02c],.hover-loan-card-large .hover-loan-card-data-wrap[data-v-5bafb02c]{border:.0625rem solid #d8d8d8;border-radius:0 0 .1875rem .1875rem;border-top:none}.hover-loan-card-large[data-v-5bafb02c]{height:25.1875rem;left:-22.7272727273%;position:absolute;top:-38.3771929825%;-webkit-transition:opacity .15s ease-out,-webkit-transform .15s linear;transition:opacity .15s ease-out,-webkit-transform .15s linear;transition:transform .15s linear,opacity .15s ease-out;transition:transform .15s linear,opacity .15s ease-out,-webkit-transform .15s linear;width:20rem;z-index:1}.hover-loan-card-large .hover-loan-card-image[data-v-5bafb02c]{height:12.5rem}.hover-loan-card-large .hover-loan-card-data-wrap[data-v-5bafb02c]{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:12.6875rem;justify-content:space-between;padding:.3125rem 1rem 1rem}.hover-loan-card-large .hover-loan-card-data-wrap .name-row[data-v-5bafb02c]{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex}.hover-loan-card-large .hover-loan-card-data-wrap .name-row .name[data-v-5bafb02c]{margin-top:.0625rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hover-loan-card-large .hover-loan-card-data-wrap .flag[data-v-5bafb02c]{margin-right:.25rem;width:1.25rem}.hover-loan-card-large.collapsed[data-v-5bafb02c]{opacity:0;pointer-events:none;-webkit-transform:scale(.6875,.5657568238);transform:scale(.6875,.5657568238);-webkit-transition:opacity .15s ease-in,-webkit-transform .15s linear;transition:opacity .15s ease-in,-webkit-transform .15s linear;transition:transform .15s linear,opacity .15s ease-in;transition:transform .15s linear,opacity .15s ease-in,-webkit-transform .15s linear}.hover-loan-card-large.collapsed .hover-loan-card-image[data-v-5bafb02c]{-webkit-transform:scaleY(1.2151864035);transform:scaleY(1.2151864035)}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5585:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCard_vue_vue_type_style_index_0_id_701c836c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5300);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCard_vue_vue_type_style_index_0_id_701c836c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_HoverLoanCard_vue_vue_type_style_index_0_id_701c836c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5586:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".base-portrait-hover-loan-card[data-v-701c836c]{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-box-pack:justify;-ms-flex-pack:justify;-ms-flex-negative:0;border-radius:.1875rem;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;flex-shrink:0;justify-content:space-between;opacity:1;pointer-events:auto;-webkit-transform:scale(1);transform:scale(1)}.base-portrait-hover-loan-card-image[data-v-701c836c]{-ms-flex-negative:0;border-radius:.1875rem .1875rem 0 0;flex-shrink:0;overflow:hidden;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:top center;transform-origin:top center;-webkit-transition:-webkit-transform .15s linear;transition:-webkit-transform .15s linear;transition:transform .15s linear;transition:transform .15s linear,-webkit-transform .15s linear}.base-portrait-hover-loan-card-data-wrap[data-v-701c836c]{border:.0625rem solid #d8d8d8;border-radius:0 0 .1875rem .1875rem;border-top:none}.hover-loan-card[data-v-701c836c]{padding:5.4375rem .625rem 6.8125rem;-webkit-transition:padding-bottom .15s linear,-webkit-transform .15s linear;transition:padding-bottom .15s linear,-webkit-transform .15s linear;transition:padding-bottom .15s linear,transform .15s linear;transition:padding-bottom .15s linear,transform .15s linear,-webkit-transform .15s linear}.hover-loan-card .hover-loan-card-wrapper[data-v-701c836c]{position:relative;-webkit-transition:opacity .15s ease-out;transition:opacity .15s ease-out}.hover-loan-card .hover-loan-card-wrapper .more-details-wrapper[data-v-701c836c]{bottom:-7.25rem;cursor:pointer;left:50%;opacity:0;pointer-events:none;position:absolute;-webkit-transform:translate(-50%,-.625rem);transform:translate(-50%,-.625rem);-webkit-transition:opacity .2s linear,-webkit-transform .2s linear;transition:opacity .2s linear,-webkit-transform .2s linear;transition:opacity .2s linear,transform .2s linear;transition:opacity .2s linear,transform .2s linear,-webkit-transform .2s linear}.hover-loan-card .hover-loan-card-wrapper .more-details-wrapper .more-details-arrow[data-v-701c836c]{stroke:#118aec;height:.75rem;width:1.875rem}.hover-loan-card.shift-left[data-v-701c836c]{-webkit-transform:translateX(-3.125rem);transform:translateX(-3.125rem)}.hover-loan-card.shift-left-double[data-v-701c836c]{-webkit-transform:translateX(-6.25rem);transform:translateX(-6.25rem)}.hover-loan-card.shift-right[data-v-701c836c]{-webkit-transform:translateX(3.125rem);transform:translateX(3.125rem)}.hover-loan-card.shift-right-double[data-v-701c836c]{-webkit-transform:translateX(6.25rem);transform:translateX(6.25rem)}.hover-loan-card.expanded[data-v-701c836c]{z-index:1}.hover-loan-card.expanded .hover-loan-card-wrapper .more-details-wrapper[data-v-701c836c]{opacity:1;pointer-events:auto;-webkit-transform:translate(-50%);transform:translate(-50%);-webkit-transition:opacity .2s linear .15s,-webkit-transform .2s linear .15s;transition:opacity .2s linear .15s,-webkit-transform .2s linear .15s;transition:opacity .2s linear .15s,transform .2s linear .15s;transition:opacity .2s linear .15s,transform .2s linear .15s,-webkit-transform .2s linear .15s}.hover-loan-card.row-has-detailed-loan[data-v-701c836c]{padding-bottom:.5625rem}.hover-loan-card.row-has-detailed-loan .hover-loan-card-wrapper[data-v-701c836c]{opacity:.4}.hover-loan-card.row-has-detailed-loan.is-detailed .hover-loan-card-wrapper[data-v-701c836c]{opacity:1}.hover-loan-card[data-v-701c836c]:first-of-type{padding-left:0}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5747:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue?vue&type=template&id=701c836c&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"hover-loan-card",class:{
		expanded: _vm.expanded,
		'row-has-detailed-loan': _vm.rowHasDetailedLoan,
		'is-detailed': _vm.isDetailed,
		'shift-left': _vm.shiftLeft,
		'shift-left-double': _vm.shiftLeftDouble,
		'shift-right': _vm.shiftRight,
		'shift-right-double': _vm.shiftRightDouble,
	},on:{"mouseenter":_vm.handleMouseEnterCardMargins}},[_c('div',{staticClass:"hover-loan-card-wrapper",on:{"mouseenter":_vm.handleMouseEnterCardOnly}},[_c('hover-loan-card-small',{attrs:{"amount-left":_vm.amountLeft,"is-funded":_vm.isFunded,"loan":_vm.loan,"percent-raised":_vm.percentRaised,"expanded":_vm.expanded},on:{"update-detailed-loan-index":_vm.hoverCardSmallUpdateDetailedLoanIndex}}),_vm._v(" "),_c('hover-loan-card-large',{attrs:{"amount-left":_vm.amountLeft,"is-funded":_vm.isFunded,"loan":_vm.loan,"percent-raised":_vm.percentRaised,"expanded":_vm.expanded,"expiring-soon-message":_vm.expiringSoonMessage,"is-match-at-risk":_vm.isMatchAtRisk,"is-visitor":_vm.isVisitor,"is-selected-by-another":_vm.isSelectedByAnother,"items-in-basket":_vm.itemsInBasket,"is-expired":_vm.isExpired},on:{"add-to-basket":_vm.handleAddToBasket,"track-interaction":_vm.trackInteraction,"update-detailed-loan-index":_vm.hoverCardLargeUpdateDetailedLoanIndex}}),_vm._v(" "),_c('div',{staticClass:"more-details-wrapper",class:{expanded: _vm.expanded},on:{"click":_vm.updateDetailedLoanIndex}},[_c('kv-icon',{staticClass:"more-details-arrow",attrs:{"name":"medium-chevron","from-sprite":true}})],1)],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue?vue&type=template&id=701c836c&scoped=true&

// EXTERNAL MODULE: ./src/components/Kv/KvIcon.vue + 4 modules
var KvIcon = __webpack_require__(24);

// EXTERNAL MODULE: ./src/plugins/category-row-arrows-visible-mixin.js
var category_row_arrows_visible_mixin = __webpack_require__(4947);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue?vue&type=template&id=4b9d466c&scoped=true&
var HoverLoanCardSmallvue_type_template_id_4b9d466c_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"hover-loan-card-small tw-bg-primary",class:{expanded: _vm.expanded}},[_c('loan-card-image',{staticClass:"hover-loan-card-image",attrs:{"loan-id":_vm.loan.id,"name":_vm.loan.name,"retina-image-url":_vm.loan.image.retina,"standard-image-url":_vm.loan.image.default,"is-visitor":true,"use-default-styles":false,"disable-link":true},on:{"image-click":_vm.handleClick}}),_vm._v(" "),_c('div',{staticClass:"hover-loan-card-data-wrap",on:{"click":_vm.handleClick}},[_c('p',{staticClass:"name tw-text-primary"},[_vm._v("\n\t\t\t"+_vm._s(_vm.loan.name)+"\n\t\t")]),_vm._v(" "),_c('div',{staticClass:"minimal-fundraising-meter"},[_c('fundraising-status-meter',{attrs:{"amount-left":_vm.amountLeft,"percent-raised":_vm.percentRaised,"is-funded":_vm.loan.status==='funded',"short-meter":true}})],1),_vm._v(" "),_c('p',{staticClass:"tw-text-small tw-text-secondary loan-data"},[_vm._v("\n\t\t\t"+_vm._s(_vm.loan.geocode.country.name)+" / "+_vm._s(_vm.loan.activity.name)+"\n\t\t")])])],1)}
var HoverLoanCardSmallvue_type_template_id_4b9d466c_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue?vue&type=template&id=4b9d466c&scoped=true&

// EXTERNAL MODULE: ./src/components/LoanCards/LoanCardImage.vue + 9 modules
var LoanCardImage = __webpack_require__(697);

// EXTERNAL MODULE: ./src/components/LoanCards/FundraisingStatus/FundraisingStatusMeter.vue + 2 modules
var FundraisingStatusMeter = __webpack_require__(708);

// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/hoverLoanCardMixin.js
/* harmony default export */ var hoverLoanCardMixin = ({
  props: {
    amountLeft: {
      type: Number,
      default: 0
    },
    isFunded: {
      type: Boolean,
      default: false
    },
    loan: {
      type: Object,
      default: function _default() {
        return {
          userProperties: {},
          loanFundraisingInfo: {},
          geocode: {
            country: {}
          },
          image: {}
        };
      }
    },
    percentRaised: {
      type: Number,
      default: 0
    }
  },
  methods: {
    trackInteraction: function trackInteraction(args) {
      this.$emit('track-interaction', args);
    }
  }
});
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue?vue&type=script&lang=js&
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
//
//
//
//
//
//



/* harmony default export */ var HoverLoanCardSmallvue_type_script_lang_js_ = ({
  name: 'HoverLoanCardSmall',
  components: {
    LoanCardImage: LoanCardImage["a" /* default */],
    FundraisingStatusMeter: FundraisingStatusMeter["a" /* default */]
  },
  inject: ['apollo'],
  mixins: [hoverLoanCardMixin],
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.$emit('update-detailed-loan-index');
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue?vue&type=script&lang=js&
 /* harmony default export */ var HoverLoanCard_HoverLoanCardSmallvue_type_script_lang_js_ = (HoverLoanCardSmallvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue?vue&type=style&index=0&id=4b9d466c&lang=scss&scoped=true&
var HoverLoanCardSmallvue_type_style_index_0_id_4b9d466c_lang_scss_scoped_true_ = __webpack_require__(5581);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardSmall.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  HoverLoanCard_HoverLoanCardSmallvue_type_script_lang_js_,
  HoverLoanCardSmallvue_type_template_id_4b9d466c_scoped_true_render,
  HoverLoanCardSmallvue_type_template_id_4b9d466c_scoped_true_staticRenderFns,
  false,
  null,
  "4b9d466c",
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var HoverLoanCardSmall = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"HoverLoanCardSmall","exportName":"default","description":"","tags":{},"props":[{"name":"expanded","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"events":[{"name":"update-detailed-loan-index"}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue?vue&type=template&id=5bafb02c&scoped=true&
var HoverLoanCardLargevue_type_template_id_5bafb02c_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"hover-loan-card-large tw-bg-primary",class:{collapsed: !_vm.expanded}},[_c('loan-card-image',{staticClass:"hover-loan-card-image",attrs:{"loan-id":_vm.loan.id,"name":_vm.loan.name,"retina-image-url":_vm.loan.image.retina,"standard-image-url":_vm.loan.image.default,"is-visitor":_vm.isVisitor,"use-default-styles":false,"disable-link":true},on:{"favorite-toggled":_vm.toggleFavorite,"image-click":_vm.updateDetailedLoanIndex}}),_vm._v(" "),_c('div',{staticClass:"hover-loan-card-data-wrap"},[_c('div',[_c('div',{staticClass:"name-row"},[(_vm.loan.geocode.country.isoCode)?_c('kv-flag',{staticClass:"flag",attrs:{"country":_vm.loan.geocode.country.isoCode}}):_vm._e(),_vm._v(" "),_c('borrower-info-name',{staticClass:"name tw-text-h3",attrs:{"name":_vm.loan.name,"loan-id":_vm.loan.id},on:{"track-loan-card-interaction":_vm.trackInteractionBorrowerInfoName}})],1),_vm._v(" "),_c('fundraising-status',{attrs:{"amount-left":_vm.amountLeft,"percent-raised":_vm.percentRaised,"expiring-soon-message":_vm.expiringSoonMessage,"is-funded":_vm.isFunded,"left-and-to-go-on-top":true,"short-meter":true}})],1),_vm._v(" "),_c('borrower-info-body',{staticClass:"hover-borrower-info-body tw-text-small tw-font-book",attrs:{"use":_vm.loan.fullLoanUse,"loan-id":_vm.loan.id,"max-use-length":100,"disable-link":true,"read-more-link-text":"Expand to learn more"},on:{"read-more-link":_vm.updateDetailedLoanIndex,"track-loan-card-interaction":_vm.trackInteraction}}),_vm._v(" "),_c('div',{staticClass:"tw-gap-1 tw-flex tw-w-full"},[_c('action-button',{staticClass:"tw-py-1 tw-px-0 tw-m-0 tw-w-2/4 tw-shrink-0",attrs:{"loan-id":_vm.loan.id,"loan":_vm.loan,"items-in-basket":_vm.itemsInBasket,"is-lent-to":_vm.loan.userProperties.lentTo,"is-funded":_vm.isFunded,"is-expired":_vm.isExpired,"is-selected-by-another":_vm.isSelectedByAnother,"is-simple-lend-button":true,"minimal-checkout-button":true,"is-amount-lend-button":_vm.lessThan25,"amount-left":_vm.amountLeft},on:{"add-to-basket":_vm.handleAddToBasket},nativeOn:{"click":function($event){return _vm.trackInteraction({
					interactionType: 'addToBasket',
					interactionElement: 'Lend25'
				})}}}),_vm._v(" "),(!_vm.isMatchAtRisk)?_c('div',{staticClass:"tw-mt-1",class:{hide: _vm.isFunded || _vm.isExpired}},[_c('matching-text',{attrs:{"matching-text":_vm.loan.matchingText,"match-ratio":_vm.loan.matchRatio,"is-funded":_vm.isFunded,"is-selected-by-another":_vm.isSelectedByAnother,"wrap":true}})],1):_vm._e()],1)],1)],1)}
var HoverLoanCardLargevue_type_template_id_5bafb02c_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue?vue&type=template&id=5bafb02c&scoped=true&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./src/components/Kv/KvFlag.vue + 4 modules
var KvFlag = __webpack_require__(207);

// EXTERNAL MODULE: ./src/components/LoanCards/FundraisingStatus/FundraisingStatus.vue + 4 modules
var FundraisingStatus = __webpack_require__(702);

// EXTERNAL MODULE: ./src/components/LoanCards/Buttons/ActionButton.vue + 34 modules
var ActionButton = __webpack_require__(445);

// EXTERNAL MODULE: ./src/components/LoanCards/MatchingText.vue + 2 modules
var MatchingText = __webpack_require__(699);

// EXTERNAL MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoName.vue + 4 modules
var BorrowerInfoName = __webpack_require__(1402);

// EXTERNAL MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoBody.vue + 4 modules
var BorrowerInfoBody = __webpack_require__(701);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue?vue&type=script&lang=js&


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty_default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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








/* harmony default export */ var HoverLoanCardLargevue_type_script_lang_js_ = ({
  name: 'HoverLoanCardLarge',
  components: {
    BorrowerInfoBody: BorrowerInfoBody["a" /* default */],
    KvFlag: KvFlag["a" /* default */],
    LoanCardImage: LoanCardImage["a" /* default */],
    FundraisingStatus: FundraisingStatus["a" /* default */],
    ActionButton: ActionButton["a" /* default */],
    MatchingText: MatchingText["a" /* default */],
    BorrowerInfoName: BorrowerInfoName["a" /* default */]
  },
  inject: ['apollo'],
  mixins: [hoverLoanCardMixin],
  props: {
    expiringSoonMessage: {
      type: String,
      default: ''
    },
    isSelectedByAnother: {
      type: Boolean,
      default: false
    },
    itemsInBasket: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    isVisitor: {
      type: Boolean,
      required: true
    },
    expanded: {
      type: Boolean,
      default: false
    },
    isExpired: {
      type: Boolean,
      default: false
    },
    isMatchAtRisk: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    lessThan25: function lessThan25() {
      return this.amountLeft < 25 && this.amountLeft !== 0;
    }
  },
  methods: {
    toggleFavorite: function toggleFavorite() {
      this.$emit('toggle-favorite');
    },
    updateDetailedLoanIndex: function updateDetailedLoanIndex() {
      this.$emit('update-detailed-loan-index');
    },
    trackInteraction: function trackInteraction(args) {
      this.$emit('track-interaction', args);
    },
    trackInteractionBorrowerInfoName: function trackInteractionBorrowerInfoName(args) {
      this.trackInteraction(_objectSpread(_objectSpread({}, args), {}, {
        interactionElement: "".concat(args.interactionElement, "HoverCard")
      }));
    },
    handleAddToBasket: function handleAddToBasket(payload) {
      this.$emit('add-to-basket', payload);
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue?vue&type=script&lang=js&
 /* harmony default export */ var HoverLoanCard_HoverLoanCardLargevue_type_script_lang_js_ = (HoverLoanCardLargevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue?vue&type=style&index=0&id=5bafb02c&lang=scss&scoped=true&
var HoverLoanCardLargevue_type_style_index_0_id_5bafb02c_lang_scss_scoped_true_ = __webpack_require__(5583);

// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCardLarge.vue






/* normalize component */

var HoverLoanCardLarge_component = Object(componentNormalizer["a" /* default */])(
  HoverLoanCard_HoverLoanCardLargevue_type_script_lang_js_,
  HoverLoanCardLargevue_type_template_id_5bafb02c_scoped_true_render,
  HoverLoanCardLargevue_type_template_id_5bafb02c_scoped_true_staticRenderFns,
  false,
  null,
  "5bafb02c",
  null
  
)

const HoverLoanCardLarge_vuedocgen_export_0 = HoverLoanCardLarge_component.exports;
/* harmony default export */ var HoverLoanCardLarge = (HoverLoanCardLarge_vuedocgen_export_0);
HoverLoanCardLarge_vuedocgen_export_0.__docgenInfo = {"displayName":"HoverLoanCardLarge","exportName":"default","description":"","tags":{},"props":[{"name":"expiringSoonMessage","type":{"name":"string"},"defaultValue":{"func":false,"value":"''"}},{"name":"isSelectedByAnother","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"itemsInBasket","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"isVisitor","type":{"name":"boolean"},"required":true},{"name":"expanded","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"isExpired","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"isMatchAtRisk","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"events":[{"name":"toggle-favorite"},{"name":"update-detailed-loan-index"},{"name":"track-interaction","type":{"names":["undefined"]}},{"name":"add-to-basket","type":{"names":["undefined"]}}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue?vue&type=script&lang=js&
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





/* harmony default export */ var HoverLoanCardvue_type_script_lang_js_ = ({
  name: 'HoverLoanCard',
  components: {
    HoverLoanCardSmall: HoverLoanCardSmall,
    HoverLoanCardLarge: HoverLoanCardLarge,
    KvIcon: KvIcon["a" /* default */]
  },
  props: {
    cardNumber: {
      type: Number,
      default: null
    },
    expiringSoonMessage: {
      type: String,
      default: ''
    },
    isSelectedByAnother: {
      type: Boolean,
      default: false
    },
    itemsInBasket: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    isMatchAtRisk: {
      type: Boolean,
      default: false
    },
    isVisitor: {
      type: Boolean,
      required: true
    },
    detailedLoanIndex: {
      type: Number,
      default: null
    },
    hoverLoanIndex: {
      type: Number,
      default: null
    },
    shiftIncrement: {
      type: Number,
      default: 0
    },
    preventUpdatingDetailedCard: {
      type: Boolean,
      default: false
    },
    isExpired: {
      type: Boolean,
      default: false
    },
    showTags: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    expanded: function expanded() {
      return !this.rowHasDetailedLoan && this.hover;
    },
    hover: function hover() {
      return this.loanIndex === this.hoverLoanIndex;
    },
    isDetailed: function isDetailed() {
      return this.loanIndex === this.detailedLoanIndex;
    },
    loanIndex: function loanIndex() {
      return this.cardNumber - 1;
    },
    rowHasDetailedLoan: function rowHasDetailedLoan() {
      return this.detailedLoanIndex !== null;
    },
    rowHasHoverLoan: function rowHasHoverLoan() {
      return this.hoverLoanIndex !== null;
    },
    shiftLeft: function shiftLeft() {
      return !this.rowHasDetailedLoan && this.shiftIncrement === -1;
    },
    shiftLeftDouble: function shiftLeftDouble() {
      return !this.rowHasDetailedLoan && this.shiftIncrement === -2;
    },
    shiftRight: function shiftRight() {
      return !this.rowHasDetailedLoan && this.shiftIncrement === 1;
    },
    shiftRightDouble: function shiftRightDouble() {
      return !this.rowHasDetailedLoan && this.shiftIncrement === 2;
    }
  },
  mixins: [hoverLoanCardMixin, category_row_arrows_visible_mixin["a" /* default */]],
  methods: {
    handleMouseEnter: function handleMouseEnter() {
      if (this.rowHasDetailedLoan && !this.isDetailed) {
        if (!this.preventUpdatingDetailedCard && this.hoverEffectActive()) {
          this.updateDetailedLoanIndex();
        }
      } else if (this.hoverEffectActive()) {
        this.updateHoverLoanIndex();
      }
    },
    handleMouseEnterCardMargins: function handleMouseEnterCardMargins() {
      if (this.rowHasHoverLoan) {
        this.handleMouseEnter();
      }
    },
    handleMouseEnterCardOnly: function handleMouseEnterCardOnly() {
      if (!this.rowHasHoverLoan) {
        this.handleMouseEnter();
      }
    },
    hoverEffectActive: function hoverEffectActive() {
      var windowWidth = document.documentElement.clientWidth;
      var arrowsVisible = this.categoryRowArrowsVisible();
      return arrowsVisible && windowWidth >= 800 || !arrowsVisible && windowWidth >= 768;
    },
    updateHoverLoanIndex: function updateHoverLoanIndex() {
      this.$emit('update-hover-loan-index', this.loanIndex);
      this.trackInteraction({
        interactionType: 'hover-expand',
        interactionElement: 'hover-card'
      });
    },
    updateDetailedLoanIndex: function updateDetailedLoanIndex() {
      this.$emit('update-detailed-loan-index', this.loanIndex);
      this.trackInteraction({
        interactionType: 'hover-details-click',
        interactionElement: 'hover-card'
      });
    },
    trackInteraction: function trackInteraction(args) {
      this.$emit('track-interaction', args);
    },
    hoverCardLargeUpdateDetailedLoanIndex: function hoverCardLargeUpdateDetailedLoanIndex() {
      if (!this.rowHasDetailedLoan) {
        this.$emit('set-prevent-updating-detailed-card', true);
      }

      this.updateDetailedLoanIndex();
    },
    hoverCardSmallUpdateDetailedLoanIndex: function hoverCardSmallUpdateDetailedLoanIndex() {
      this.$emit('set-prevent-updating-detailed-card', false);
      this.updateDetailedLoanIndex();
    },
    handleAddToBasket: function handleAddToBasket(payload) {
      this.$emit('add-to-basket', payload);
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue?vue&type=script&lang=js&
 /* harmony default export */ var HoverLoanCard_HoverLoanCardvue_type_script_lang_js_ = (HoverLoanCardvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue?vue&type=style&index=0&id=701c836c&lang=scss&scoped=true&
var HoverLoanCardvue_type_style_index_0_id_701c836c_lang_scss_scoped_true_ = __webpack_require__(5585);

// CONCATENATED MODULE: ./src/components/LoanCards/HoverLoanCard/HoverLoanCard.vue






/* normalize component */

var HoverLoanCard_component = Object(componentNormalizer["a" /* default */])(
  HoverLoanCard_HoverLoanCardvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "701c836c",
  null
  
)

const HoverLoanCard_vuedocgen_export_0 = HoverLoanCard_component.exports;
/* harmony default export */ var HoverLoanCard = __webpack_exports__["default"] = (HoverLoanCard_vuedocgen_export_0);
HoverLoanCard_vuedocgen_export_0.__docgenInfo = {"exportName":"default","displayName":"HoverLoanCard","description":"","tags":{},"props":[{"name":"amountLeft","mixin":{"name":"hoverLoanCardMixin","path":"hoverLoanCardMixin.js"},"type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}},{"name":"isFunded","mixin":{"name":"hoverLoanCardMixin","path":"hoverLoanCardMixin.js"},"type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"loan","mixin":{"name":"hoverLoanCardMixin","path":"hoverLoanCardMixin.js"},"type":{"name":"object"},"defaultValue":{"func":false,"value":"{\n    userProperties: {},\n    loanFundraisingInfo: {},\n    geocode: {\n        country: {}\n    },\n    image: {}\n}"}},{"name":"percentRaised","mixin":{"name":"hoverLoanCardMixin","path":"hoverLoanCardMixin.js"},"type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}},{"name":"cardNumber","type":{"name":"number"},"defaultValue":{"func":false,"value":"null"}},{"name":"expiringSoonMessage","type":{"name":"string"},"defaultValue":{"func":false,"value":"''"}},{"name":"isSelectedByAnother","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"itemsInBasket","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"isMatchAtRisk","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"isVisitor","type":{"name":"boolean"},"required":true},{"name":"detailedLoanIndex","type":{"name":"number"},"defaultValue":{"func":false,"value":"null"}},{"name":"hoverLoanIndex","type":{"name":"number"},"defaultValue":{"func":false,"value":"null"}},{"name":"shiftIncrement","type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}},{"name":"preventUpdatingDetailedCard","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"isExpired","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"showTags","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"events":[{"name":"track-interaction","mixin":{"name":"hoverLoanCardMixin","path":"hoverLoanCardMixin.js"},"type":{"names":["undefined"]}},{"name":"update-hover-loan-index","type":{"names":["undefined"]}},{"name":"update-detailed-loan-index","type":{"names":["undefined"]}},{"name":"set-prevent-updating-detailed-card","type":{"names":["undefined"]}},{"name":"add-to-basket","type":{"names":["undefined"]}}]}

/***/ })

}]);