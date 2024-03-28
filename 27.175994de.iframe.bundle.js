(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[27],{

/***/ 5320:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5641);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("6a1708fc", content, true, {});

/***/ }),

/***/ 5640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreditSummaryLightbox_vue_vue_type_style_index_0_id_6458db80_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5320);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreditSummaryLightbox_vue_vue_type_style_index_0_id_6458db80_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreditSummaryLightbox_vue_vue_type_style_index_0_id_6458db80_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".amount-table-row[data-v-6458db80]:nth-child(2n){--tw-bg-opacity:1;background-color:rgba(var(--bg-secondary),var(--tw-bg-opacity))}.amount-table-row td[data-v-6458db80]{padding:.25rem .5rem}.amount-table-row td[data-v-6458db80]:last-child{text-align:right}.amount-placeholder[data-v-6458db80]{float:right;height:1rem;width:2.5rem}.header-amount-placeholder[data-v-6458db80]{float:right;height:1.25rem;width:3.5rem}@media (min-width:45.875rem){.credit-summary[data-v-6458db80] [role=dialog]{min-width:32rem}}@media (min-width:64rem){.credit-summary[data-v-6458db80] [role=dialog]{min-width:40rem}.amount-placeholder[data-v-6458db80]{height:1.25rem;width:3rem}.header-amount-placeholder[data-v-6458db80]{height:1.75rem;width:4.5rem}}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5761:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue?vue&type=template&id=6458db80&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('kv-text-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['portfolio', 'click', 'credit-stats-details']),expression:"['portfolio', 'click', 'credit-stats-details']"}],attrs:{"icon":_vm.mdiFileDocumentOutline},on:{"click":_vm.openLightbox}},[_vm._v("\n\t\tDetails\n\t")]),_vm._v(" "),_c('kv-lightbox',{staticClass:"credit-summary",attrs:{"visible":_vm.showLightbox,"title":"Account balance sheet","data-testid":"credit-summary"},on:{"lightbox-closed":_vm.closeLightbox}},[_c('p',{staticClass:"tw-text-small tw-text-secondary tw-mb-2"},[_vm._v("\n\t\t\tPlease note, summary data may be up to one hour old.\n\t\t")]),_vm._v(" "),_c('table',{staticClass:"tw-w-full tw-mb-4"},[_c('caption',{staticClass:"tw-sr-only"},[_vm._v("\n\t\t\t\tDeposits\n\t\t\t")]),_vm._v(" "),_c('thead',{staticClass:"tw-sr-only"},[_c('tr',[_c('th',[_vm._v("Deposit type")]),_vm._v(" "),_c('th',[_vm._v("Amount")])])]),_vm._v(" "),_c('tbody',[_c('tr',{staticClass:"tw-text-h3"},[_c('td',{staticClass:"tw-py-1"},[_vm._v("\n\t\t\t\t\t\tTotal deposits\n\t\t\t\t\t")]),_vm._v(" "),_c('td',{staticClass:"tw-p-1 tw-text-right tw-text-action"},[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"header-amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(_vm.depositSubTotal)))])],1)]),_vm._v(" "),_vm._l((_vm.deposits),function(deposit){return [(!deposit.hideWhenZero || deposit.value !== 0)?_c('tr',{key:deposit.label,staticClass:"amount-table-row"},[_c('td',[_vm._v(_vm._s(deposit.label))]),_vm._v(" "),_c('td',[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(deposit.value)))])],1)]):_vm._e()]})],2)]),_vm._v(" "),_c('table',{staticClass:"tw-w-full tw-mb-4"},[_c('caption',{staticClass:"tw-sr-only"},[_vm._v("\n\t\t\t\tDeductions\n\t\t\t")]),_vm._v(" "),_c('thead',{staticClass:"tw-sr-only"},[_c('tr',[_c('th',[_vm._v("Deduction type")]),_vm._v(" "),_c('th',[_vm._v("Amount")])])]),_vm._v(" "),_c('tbody',[_c('tr',{staticClass:"tw-text-h3"},[_c('td',{staticClass:"tw-py-1"},[_vm._v("\n\t\t\t\t\t\tTotal deductions\n\t\t\t\t\t")]),_vm._v(" "),_c('td',{staticClass:"tw-p-1 tw-text-right tw-text-danger"},[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"header-amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(_vm.deductionSubTotal)))])],1)]),_vm._v(" "),_vm._l((_vm.deductions),function(deduction){return [(!deduction.hideWhenZero || deduction.value !== 0)?_c('tr',{key:deduction.label,staticClass:"amount-table-row"},[_c('td',[_vm._v(_vm._s(deduction.label))]),_vm._v(" "),_c('td',[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(deduction.value)))])],1)]):_vm._e()]})],2)]),_vm._v(" "),_c('table',{staticClass:"tw-w-full"},[_c('caption',{staticClass:"tw-sr-only"},[_vm._v("\n\t\t\t\tCurrent credits\n\t\t\t")]),_vm._v(" "),_c('thead',{staticClass:"tw-sr-only"},[_c('tr',[_c('th',[_vm._v("Credit type")]),_vm._v(" "),_c('th',[_vm._v("Amount")])])]),_vm._v(" "),_c('tbody',[_c('tr',{staticClass:"tw-text-h3"},[_c('td',{staticClass:"tw-py-1"},[_vm._v("\n\t\t\t\t\t\tTotal credit in Kiva\n\t\t\t\t\t")]),_vm._v(" "),_c('td',{staticClass:"tw-p-1 tw-text-right"},[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"header-amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(_vm.totalCreditInKiva)))])],1)]),_vm._v(" "),_c('tr',{staticClass:"amount-table-row"},[_c('td',[_vm._v("\n\t\t\t\t\t\tOutstanding balance\n\t\t\t\t\t\t"),(_vm.promoOutstanding > 0)?_c('span',[_vm._v("\n\t\t\t\t\t\t\t(minus "+_vm._s(_vm.formatCash(_vm.promoOutstanding))+" promo credit balance)\n\t\t\t\t\t\t")]):_vm._e()]),_vm._v(" "),_c('td',[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(_vm.amountOutstanding)))])],1)]),_vm._v(" "),_c('tr',{staticClass:"amount-table-row"},[_c('td',[_vm._v("Kiva credit")]),_vm._v(" "),_c('td',[(_vm.loading)?_c('kv-loading-placeholder',{staticClass:"amount-placeholder"}):_c('span',[_vm._v(_vm._s(_vm.formatCash(_vm.kivaCredit)))])],1)])])])])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue?vue&type=template&id=6458db80&scoped=true&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(8);
var taggedTemplateLiteral_default = /*#__PURE__*/__webpack_require__.n(taggedTemplateLiteral);

// EXTERNAL MODULE: ./node_modules/graphql-tag/lib/index.js + 20 modules
var lib = __webpack_require__(4247);

// EXTERNAL MODULE: ./node_modules/@mdi/js/mdi.js
var mdi = __webpack_require__(11);

// EXTERNAL MODULE: ./node_modules/numeral/numeral.js
var numeral = __webpack_require__(6);
var numeral_default = /*#__PURE__*/__webpack_require__.n(numeral);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvLightbox.vue + 8 modules
var KvLightbox = __webpack_require__(57);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvLoadingPlaceholder.vue + 2 modules
var KvLoadingPlaceholder = __webpack_require__(41);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvTextLink.vue + 4 modules
var KvTextLink = __webpack_require__(156);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue?vue&type=script&lang=js&


var _templateObject;

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







var CreditSummaryLightboxvue_type_script_lang_js_asNumber = function asNumber(value) {
  return numeral_default()(value !== null && value !== void 0 ? value : 0).value();
};

/* harmony default export */ var CreditSummaryLightboxvue_type_script_lang_js_ = ({
  name: 'CreditSummaryLightbox',
  inject: ['apollo'],
  components: {
    KvLightbox: KvLightbox["a" /* default */],
    KvLoadingPlaceholder: KvLoadingPlaceholder["a" /* default */],
    KvTextLink: KvTextLink["a" /* default */]
  },
  data: function data() {
    return {
      loading: true,
      loadingPromise: null,
      mdiFileDocumentOutline: mdi["v" /* mdiFileDocumentOutline */],
      showLightbox: false,
      // Deposits
      totalAmountDeposited: 0,
      amountDepositedByKiva: 0,
      kivaCardsRedeemedAmount: 0,
      kivaCardsCanceledAmount: 0,
      currencyGainsAmount: 0,
      // Deductions
      amountDonated: 0,
      currencyLossesAmount: 0,
      defaultLossesAmount: 0,
      kivaCardsPurchasedAmount: 0,
      amountWithdrawn: 0,
      // Current credit
      amountOutstanding: 0,
      promoOutstanding: 0,
      kivaCredit: 0
    };
  },
  computed: {
    deposits: function deposits() {
      return [{
        label: 'Your deposits',
        value: this.totalAmountDeposited
      }, {
        label: 'Deposits by Kiva',
        value: this.amountDepositedByKiva,
        hideWhenZero: true
      }, {
        label: 'Kiva Card redemptions',
        value: this.kivaCardsRedeemedAmount
      }, {
        label: 'Kiva Card cancellations',
        value: this.kivaCardsCanceledAmount
      }, {
        label: 'Currency loss reimbursements',
        value: this.currencyGainsAmount
      }];
    },
    deductions: function deductions() {
      return [{
        label: 'Donations to Kiva',
        value: this.amountDonated
      }, {
        label: 'Currency losses',
        value: this.currencyLossesAmount
      }, {
        label: 'Default losses',
        value: this.defaultLossesAmount
      }, {
        label: 'Kiva Card purchases',
        value: this.kivaCardsPurchasedAmount
      }, {
        label: 'Withdrawals',
        value: this.amountWithdrawn
      }];
    },
    depositSubTotal: function depositSubTotal() {
      // sum of all deposits
      return this.deposits.reduce(function (total, _ref) {
        var value = _ref.value;
        return total + value;
      }, 0);
    },
    deductionSubTotal: function deductionSubTotal() {
      // sum of all deductions
      return this.deductions.reduce(function (total, _ref2) {
        var value = _ref2.value;
        return total + value;
      }, 0);
    },
    totalCreditInKiva: function totalCreditInKiva() {
      // assuming deductionSubTotal is negative
      return this.depositSubTotal + this.deductionSubTotal;
    }
  },
  methods: {
    openLightbox: function openLightbox() {
      this.showLightbox = true;
      this.fetchAsyncData();
    },
    closeLightbox: function closeLightbox() {
      this.showLightbox = false;
    },
    formatCash: function formatCash(value) {
      return numeral_default()(value).format('$0,0.00');
    },
    fetchAsyncData: function fetchAsyncData() {
      var _this = this;

      if (this.loading && !this.loadingPromise) {
        this.loadingPromise = this.apollo.query({
          query: Object(lib["a" /* gql */])(_templateObject || (_templateObject = taggedTemplateLiteral_default()(["query creditSummary {\n\t\t\t\t\t\tmy {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tamountDonated\n\t\t\t\t\t\t\tamountWithdrawn\n\t\t\t\t\t\t\tamountDepositedByKiva\n\t\t\t\t\t\t\tcurrencyGainsAmount\n\t\t\t\t\t\t\tcurrencyLossesAmount\n\t\t\t\t\t\t\tdefaultLossesAmount\n\t\t\t\t\t\t\toutstandingPromoCreditAmount\n\t\t\t\t\t\t\tkivaCardsCanceledAmount\n\t\t\t\t\t\t\tkivaCardsPurchasedAmount\n\t\t\t\t\t\t\tkivaCardsRedeemedAmount\n\t\t\t\t\t\t\tlendingStats {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\ttotalAmountDeposited\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tuserAccount {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tbalance\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tuserStats {\n\t\t\t\t\t\t\t\tamount_outstanding\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}"])))
        }).then(function (_ref3) {
          var _data$my, _data$my$lendingStats, _data$my2, _data$my3, _data$my4, _data$my5, _data$my6, _data$my7, _data$my8, _data$my9, _data$my10, _data$my11, _data$my11$userAccoun, _data$my12, _data$my12$userStats, _data$my13;

          var data = _ref3.data;
          _this.loading = false;
          _this.totalAmountDeposited = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my = data.my) === null || _data$my === void 0 ? void 0 : (_data$my$lendingStats = _data$my.lendingStats) === null || _data$my$lendingStats === void 0 ? void 0 : _data$my$lendingStats.totalAmountDeposited);
          _this.amountDepositedByKiva = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my2 = data.my) === null || _data$my2 === void 0 ? void 0 : _data$my2.amountDepositedByKiva);
          _this.kivaCardsRedeemedAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my3 = data.my) === null || _data$my3 === void 0 ? void 0 : _data$my3.kivaCardsRedeemedAmount);
          _this.kivaCardsCanceledAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my4 = data.my) === null || _data$my4 === void 0 ? void 0 : _data$my4.kivaCardsCanceledAmount);
          _this.currencyGainsAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my5 = data.my) === null || _data$my5 === void 0 ? void 0 : _data$my5.currencyGainsAmount);
          _this.amountDonated = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my6 = data.my) === null || _data$my6 === void 0 ? void 0 : _data$my6.amountDonated);
          _this.currencyLossesAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my7 = data.my) === null || _data$my7 === void 0 ? void 0 : _data$my7.currencyLossesAmount);
          _this.defaultLossesAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my8 = data.my) === null || _data$my8 === void 0 ? void 0 : _data$my8.defaultLossesAmount) * -1;
          _this.kivaCardsPurchasedAmount = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my9 = data.my) === null || _data$my9 === void 0 ? void 0 : _data$my9.kivaCardsPurchasedAmount);
          _this.amountWithdrawn = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my10 = data.my) === null || _data$my10 === void 0 ? void 0 : _data$my10.amountWithdrawn);
          _this.kivaCredit = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my11 = data.my) === null || _data$my11 === void 0 ? void 0 : (_data$my11$userAccoun = _data$my11.userAccount) === null || _data$my11$userAccoun === void 0 ? void 0 : _data$my11$userAccoun.balance);
          _this.amountOutstanding = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my12 = data.my) === null || _data$my12 === void 0 ? void 0 : (_data$my12$userStats = _data$my12.userStats) === null || _data$my12$userStats === void 0 ? void 0 : _data$my12$userStats.amount_outstanding);
          _this.promoOutstanding = CreditSummaryLightboxvue_type_script_lang_js_asNumber(data === null || data === void 0 ? void 0 : (_data$my13 = data.my) === null || _data$my13 === void 0 ? void 0 : _data$my13.outstandingPromoCreditAmount);
        }).finally(function () {
          _this.loadingPromise = null;
        });
      }
    }
  }
});
// CONCATENATED MODULE: ./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue?vue&type=script&lang=js&
 /* harmony default export */ var ImpactDashboard_CreditSummaryLightboxvue_type_script_lang_js_ = (CreditSummaryLightboxvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue?vue&type=style&index=0&id=6458db80&lang=postcss&scoped=true&
var CreditSummaryLightboxvue_type_style_index_0_id_6458db80_lang_postcss_scoped_true_ = __webpack_require__(5640);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/pages/Portfolio/ImpactDashboard/CreditSummaryLightbox.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  ImpactDashboard_CreditSummaryLightboxvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "6458db80",
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var CreditSummaryLightbox = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"CreditSummaryLightbox","exportName":"default","description":"","tags":{}}

/***/ })

}]);