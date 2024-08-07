(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[21],{

/***/ 5105:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5270);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(12).default
var update = add("5076fe0c", content, true, {});

/***/ }),

/***/ 5106:
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

/***/ 5107:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5272);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(12).default
var update = add("fdf39c3c", content, true, {});

/***/ }),

/***/ 5173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _graphql_mutation_updateActiveLoan_graphql__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5268);
/* harmony import */ var _graphql_mutation_updateActiveLoan_graphql__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_graphql_mutation_updateActiveLoan_graphql__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_injectionCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(167);

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


var injections = ['apollo'];
var emptyActiveLoan = {
  xCoordinate: 0,
  yCoordinate: 0,
  loan: JSON.stringify({
    activity: {},
    userProperties: {},
    loanFundraisingInfo: {},
    geocode: {
      country: {}
    },
    image: {}
  }),
  hoverLoanId: 0,
  tracking: JSON.stringify({})
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      activeLoan: emptyActiveLoan
    };
  },
  computed: {
    hoverLoan: function hoverLoan() {
      try {
        return JSON.parse(this.activeLoan.loan);
      } catch (e) {
        return {};
      }
    },
    hoverLoanId: function hoverLoanId() {
      return this.activeLoan.hoverLoanId;
    },
    hoverLoanXCoordinate: function hoverLoanXCoordinate() {
      return this.activeLoan.xCoordinate;
    },
    hoverLoanYCoordinate: function hoverLoanYCoordinate() {
      return this.activeLoan.yCoordinate;
    },
    tracking: function tracking() {
      try {
        return JSON.parse(this.activeLoan.tracking);
      } catch (e) {
        return {};
      }
    }
  },
  methods: {
    setHoverLoan: function setHoverLoan(_ref) {
      var xCoordinate = _ref.xCoordinate,
        yCoordinate = _ref.yCoordinate,
        hoverLoanId = _ref.hoverLoanId,
        loan = _ref.loan,
        tracking = _ref.tracking;
      Object(_util_injectionCheck__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(this, injections);
      this.apollo.mutate({
        mutation: _graphql_mutation_updateActiveLoan_graphql__WEBPACK_IMPORTED_MODULE_1___default.a,
        variables: _objectSpread(_objectSpread({}, this.activeLoan), {}, {
          xCoordinate: xCoordinate,
          yCoordinate: yCoordinate,
          hoverLoanId: hoverLoanId,
          loan: loan,
          tracking: tracking
        })
      });
    },
    clearHoverLoan: function clearHoverLoan() {
      Object(_util_injectionCheck__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(this, injections);
      this.apollo.mutate({
        mutation: _graphql_mutation_updateActiveLoan_graphql__WEBPACK_IMPORTED_MODULE_1___default.a,
        variables: emptyActiveLoan
      });
    }
  }
});

/***/ }),

/***/ 5174:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  props: {
    amountLeft: {
      type: Number,
      default: 0
    },
    expiringSoonMessage: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    isFunded: {
      type: Boolean,
      default: false
    },
    isMatchAtRisk: {
      type: Boolean,
      default: false
    },
    isSelectedByAnother: {
      type: Boolean,
      default: false
    },
    isVisitor: {
      type: Boolean,
      required: true
    },
    itemsInBasket: {
      type: Array,
      default: function _default() {
        return [];
      }
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
    },
    expanded: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: Number,
      default: null
    },
    categorySetId: {
      type: String,
      default: ''
    },
    rowNumber: {
      type: Number,
      default: null
    },
    cardNumber: {
      type: Number,
      default: null
    }
  },
  methods: {
    toggleFavorite: function toggleFavorite() {
      this.$emit('toggle-favorite');
    },
    trackInteraction: function trackInteraction(args) {
      this.$emit('track-interaction', args);
    }
  }
});

/***/ }),

/***/ 5268:
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateActiveLoan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"xCoordinate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yCoordinate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hoverLoanId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracking"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActiveLoan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"xCoordinate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"xCoordinate"}}},{"kind":"Argument","name":{"kind":"Name","value":"yCoordinate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yCoordinate"}}},{"kind":"Argument","name":{"kind":"Name","value":"hoverLoanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hoverLoanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"loan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loan"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracking"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracking"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"},"arguments":[]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"hoverLoanId"},"arguments":[],"directives":[]}]}}]}}],"loc":{"start":0,"end":287}};
    doc.loc.source = {"body":"mutation updateActiveLoan($xCoordinate: Int, $yCoordinate: Int, $hoverLoanId: Int, $loan: String, $tracking: String) {\n\tupdateActiveLoan(xCoordinate: $xCoordinate, yCoordinate: $yCoordinate, hoverLoanId: $hoverLoanId, loan: $loan, tracking: $tracking ) @client {\n\t\tid\n\t\thoverLoanId\n\t}\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
    module.exports = doc;
    
        module.exports["updateActiveLoan"] = oneQuery(doc, "updateActiveLoan");
        


/***/ }),

/***/ 5269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BorrowerInfoHeaderExpandable_vue_vue_type_style_index_0_id_7edc5099_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5105);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BorrowerInfoHeaderExpandable_vue_vue_type_style_index_0_id_7edc5099_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BorrowerInfoHeaderExpandable_vue_vue_type_style_index_0_id_7edc5099_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".borrower-info-header-expandable[data-v-7edc5099]{margin-bottom:.75rem;white-space:nowrap}.borrower-info-header-expandable .details[data-v-7edc5099],.borrower-info-header-expandable .expandable[data-v-7edc5099],.borrower-info-header-expandable .name[data-v-7edc5099]{overflow:hidden;text-overflow:ellipsis}.borrower-info-header-expandable .name[data-v-7edc5099]{font-size:1.25rem;font-weight:400;line-height:1.75rem;margin-bottom:.3125rem}.borrower-info-header-expandable .details[data-v-7edc5099]{color:#9d9c9e;line-height:1.25rem}.borrower-info-header-expandable.expanded[data-v-7edc5099]{white-space:normal}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpandableLoanCard_vue_vue_type_style_index_0_id_07b4a60d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5107);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpandableLoanCard_vue_vue_type_style_index_0_id_07b4a60d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpandableLoanCard_vue_vue_type_style_index_0_id_07b4a60d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".expandable-loan-card[data-v-07b4a60d]{-webkit-box-orient:vertical;-webkit-box-direction:normal;background-color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100%;margin:auto;-webkit-transition:-webkit-box-shadow .1s linear;transition:-webkit-box-shadow .1s linear;transition:box-shadow .1s linear;transition:box-shadow .1s linear,-webkit-box-shadow .1s linear;width:15.875rem}.expandable-loan-card .expandable-loan-card-close[data-v-07b4a60d]{display:none;height:46px;position:relative;width:100%}.expandable-loan-card .expandable-loan-card-close .close-button[data-v-07b4a60d]{position:absolute;right:.75rem;text-align:right;top:1rem;width:3rem}.expandable-loan-card .expandable-loan-card-close .close-button .icon-small-x[data-v-07b4a60d]{fill:#c3c3c3;height:1rem;-webkit-transition:fill .16s linear;transition:fill .16s linear;width:1rem}.expandable-loan-card .expandable-loan-card-close .close-button:hover .icon-small-x[data-v-07b4a60d]{fill:#484848}.expandable-loan-card .expandable-loan-card-bottom[data-v-07b4a60d]{border:1px solid #d8d8d8;border-top:none;max-height:6.25rem;overflow-y:hidden;padding:.5rem .75rem .75rem;-webkit-transition:max-height .2s ease-out;transition:max-height .2s ease-out}.expandable-loan-card .expandable-loan-card-bottom .expandable-loan-card-action-button[data-v-07b4a60d]{margin-top:1.25rem}.expandable-loan-card.expanded[data-v-07b4a60d]{-webkit-box-shadow:.125rem .125rem .25rem rgba(0,0,0,.1);box-shadow:.125rem .125rem .25rem rgba(0,0,0,.1)}.expandable-loan-card.expanded .expandable-loan-card-bottom[data-v-07b4a60d]{max-height:28.125rem}@media print,screen and (max-width:30.06125em){.expandable-loan-card.expanded[data-v-07b4a60d]{height:auto;width:100%}.expandable-loan-card.expanded .expandable-loan-card-close[data-v-07b4a60d]{display:block}.expandable-loan-card.expanded .loan-card-image-component[data-v-07b4a60d]{margin:0 .5rem}}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue?vue&type=template&id=07b4a60d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"expandable-loan-card",class:{ expanded: _vm.expanded }},[_c('div',{staticClass:"expandable-loan-card-close show-for-small-only"},[_c('button',{staticClass:"close-button",on:{"click":function($event){$event.preventDefault();return _vm.clearHoverLoan.apply(null, arguments)}}},[_c('kv-icon',{staticClass:"icon-small-x",attrs:{"name":"small-x","from-sprite":true,"title":"Close"}})],1)]),_vm._v(" "),(_vm.loan.image.default)?_c('loan-card-image',{staticClass:"loan-card-image-component",attrs:{"loan-id":_vm.loan.id,"name":_vm.loan.name,"retina-image-url":_vm.loan.image.retina,"standard-image-url":_vm.loan.image.default,"is-visitor":_vm.isVisitor,"is-favorite":_vm.isFavorite,"loan-image-hash":_vm.loan.image.hash,"disable-link":_vm.disableImageLink},on:{"track-loan-card-interaction":_vm.trackInteraction,"favorite-toggled":_vm.toggleFavorite}}):_vm._e(),_vm._v(" "),_c('div',[_c('div',{staticClass:"expandable-loan-card-bottom"},[_c('borrower-info-header-expandable',{staticClass:"list-loan-card-borrower-info-header",attrs:{"country":_vm.loan.geocode.country.name,"activity":_vm.loan.activity.name,"name":_vm.loan.name,"loan-id":_vm.loan.id,"single-line":true,"expanded":_vm.expanded}}),_vm._v(" "),_c('fundraising-status',{attrs:{"amount-left":_vm.amountLeft,"percent-raised":_vm.percentRaised,"expiring-soon-message":_vm.expiringSoonMessage,"is-funded":_vm.loan.status==='funded',"single-line":true}}),_vm._v(" "),_c('borrower-info-body',{attrs:{"use":_vm.loan.fullLoanUse,"loan-id":_vm.loan.id,"max-use-length":170},on:{"track-loan-card-interaction":_vm.trackInteraction}}),_vm._v(" "),_c('action-button',{staticClass:"expandable-loan-card-action-button",attrs:{"loan-id":_vm.loan.id,"loan":_vm.loan,"items-in-basket":_vm.itemsInBasket,"is-lent-to":_vm.loan.userProperties.lentTo,"is-funded":_vm.isFunded,"is-selected-by-another":_vm.isSelectedByAnother,"is-simple-lend-button":true,"enable-five-dollars-notes":_vm.enableFiveDollarsNotes},on:{"add-to-basket":function($event){return _vm.$emit('add-to-basket', $event)}},nativeOn:{"click":function($event){return _vm.trackInteraction({
					interactionType: 'addToBasket',
					interactionElement: 'Lend25'
				})}}}),_vm._v(" "),(!_vm.isMatchAtRisk)?_c('matching-text',{attrs:{"matching-text":_vm.loan.matchingText,"match-ratio":_vm.loan.matchRatio,"is-funded":_vm.isFunded,"is-selected-by-another":_vm.isSelectedByAnother}}):_vm._e()],1)])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue?vue&type=template&id=07b4a60d&scoped=true&

// EXTERNAL MODULE: ./src/plugins/active-loan-mixin.js
var active_loan_mixin = __webpack_require__(5173);

// EXTERNAL MODULE: ./src/components/LoanCards/Buttons/ActionButton.vue + 34 modules
var ActionButton = __webpack_require__(493);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable.vue?vue&type=template&id=7edc5099&scoped=true&functional=true&
var BorrowerInfoHeaderExpandablevue_type_template_id_7edc5099_scoped_true_functional_true_render = function (_h,_vm) {var _c=_vm._c;return _c('div',{staticClass:"borrower-info-header-expandable",class:{'expanded': _vm.props.expanded}},[(_vm.props.name)?_c('div',{staticClass:"name"},[_vm._v("\n\t\t"+_vm._s(_vm.props.name)+"\n\t")]):_vm._e(),_vm._v(" "),(_vm.props.country || _vm.props.activity)?_c('div',{staticClass:"details"},[_vm._v("\n\t\t"+_vm._s(_vm.props.country ? ("" + (_vm.props.country)) : '')+"\n\t\t"+_vm._s(_vm.props.country && _vm.props.activity ? '|' : '')+"\n\t\t"+_vm._s(_vm.props.activity ? ("" + (_vm.props.activity)) : '')+"\n\t")]):_vm._e()])}
var BorrowerInfoHeaderExpandablevue_type_template_id_7edc5099_scoped_true_functional_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable.vue?vue&type=template&id=7edc5099&scoped=true&functional=true&

// EXTERNAL MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable.vue?vue&type=style&index=0&id=7edc5099&lang=scss&scoped=true&
var BorrowerInfoHeaderExpandablevue_type_style_index_0_id_7edc5099_lang_scss_scoped_true_ = __webpack_require__(5269);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable.vue

var script = {}



/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  script,
  BorrowerInfoHeaderExpandablevue_type_template_id_7edc5099_scoped_true_functional_true_render,
  BorrowerInfoHeaderExpandablevue_type_template_id_7edc5099_scoped_true_functional_true_staticRenderFns,
  true,
  null,
  "7edc5099",
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var BorrowerInfoHeaderExpandable = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"functional":true,"displayName":"BorrowerInfoHeaderExpandable","description":"","tags":{},"props":[{"name":"expanded","type":{"name":"undefined"}},{"name":"name","type":{"name":"undefined"}},{"name":"country","type":{"name":"undefined"}},{"name":"activity","type":{"name":"undefined"}}]}
// EXTERNAL MODULE: ./src/components/LoanCards/BorrowerInfo/BorrowerInfoBody.vue + 4 modules
var BorrowerInfoBody = __webpack_require__(756);

// EXTERNAL MODULE: ./src/components/LoanCards/FundraisingStatus/FundraisingStatus.vue + 4 modules
var FundraisingStatus = __webpack_require__(757);

// EXTERNAL MODULE: ./src/components/LoanCards/LoanCardImage.vue + 9 modules
var LoanCardImage = __webpack_require__(752);

// EXTERNAL MODULE: ./src/components/LoanCards/MatchingText.vue + 2 modules
var MatchingText = __webpack_require__(754);

// EXTERNAL MODULE: ./src/components/LoanCards/ExpandableLoanCard/expandableLoanCardMixin.js
var expandableLoanCardMixin = __webpack_require__(5174);

// EXTERNAL MODULE: ./src/plugins/category-row-arrows-visible-mixin.js
var category_row_arrows_visible_mixin = __webpack_require__(5106);

// EXTERNAL MODULE: ./src/components/Kv/KvIcon.vue + 4 modules
var KvIcon = __webpack_require__(30);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//











/* harmony default export */ var ExpandableLoanCardvue_type_script_lang_js_ = ({
  name: 'ExpandableLoanCard',
  props: {
    enableFiveDollarsNotes: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ActionButton: ActionButton["a" /* default */],
    BorrowerInfoHeaderExpandable: BorrowerInfoHeaderExpandable,
    BorrowerInfoBody: BorrowerInfoBody["a" /* default */],
    FundraisingStatus: FundraisingStatus["a" /* default */],
    LoanCardImage: LoanCardImage["a" /* default */],
    MatchingText: MatchingText["a" /* default */],
    KvIcon: KvIcon["a" /* default */]
  },
  mixins: [expandableLoanCardMixin["a" /* default */], active_loan_mixin["a" /* default */], category_row_arrows_visible_mixin["a" /* default */]],
  computed: {
    disableImageLink: function disableImageLink() {
      /*
      We are using the lack of CSS hover support to gate the visibility of the arrows. That doesn't sync with
      usingTouch unfortunately.
      */
      return !this.categoryRowArrowsVisible() && !this.expanded;
    }
  },
  methods: {
    trackInteraction: function trackInteraction(args) {
      this.$emit('track-interaction', args);
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue?vue&type=script&lang=js&
 /* harmony default export */ var ExpandableLoanCard_ExpandableLoanCardvue_type_script_lang_js_ = (ExpandableLoanCardvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue?vue&type=style&index=0&id=07b4a60d&lang=scss&scoped=true&
var ExpandableLoanCardvue_type_style_index_0_id_07b4a60d_lang_scss_scoped_true_ = __webpack_require__(5271);

// CONCATENATED MODULE: ./src/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard.vue






/* normalize component */

var ExpandableLoanCard_component = Object(componentNormalizer["a" /* default */])(
  ExpandableLoanCard_ExpandableLoanCardvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "07b4a60d",
  null
  
)

const ExpandableLoanCard_vuedocgen_export_0 = ExpandableLoanCard_component.exports;
/* harmony default export */ var ExpandableLoanCard = __webpack_exports__["default"] = (ExpandableLoanCard_vuedocgen_export_0);
ExpandableLoanCard_vuedocgen_export_0.__docgenInfo = {"displayName":"ExpandableLoanCard","exportName":"default","description":"","tags":{},"props":[{"name":"enableFiveDollarsNotes","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"events":[{"name":"add-to-basket"},{"name":"track-interaction","type":{"names":["undefined"]}}]}

/***/ })

}]);