(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ 5354:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5670);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(8).default
var update = add("4dafd5e0", content, true, {});

/***/ }),

/***/ 5355:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5672);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(8).default
var update = add("034b71d4", content, true, {});

/***/ }),

/***/ 5668:
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getClientToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useCustomerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shop"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"getClientToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"useCustomerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useCustomerId"}}}],"directives":[]}]}}]}}],"loc":{"start":0,"end":122}};
    doc.loc.source = {"body":"query getClientToken($useCustomerId: Boolean = false) {\n\tshop {\n\t\tid\n\t\tgetClientToken(useCustomerId: $useCustomerId)\n\t}\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

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
    
        module.exports["getClientToken"] = oneQuery(doc, "getClientToken");
        


/***/ }),

/***/ 5669:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_0_id_432fe388_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5354);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_0_id_432fe388_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_thread_loader_dist_cjs_js_ref_7_0_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_7_3_node_modules_sass_loader_dist_cjs_js_ref_7_4_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_0_id_432fe388_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5670:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "#dropin-container[data-v-432fe388]  .braintree-dropin{font-family:inherit}#dropin-container[data-v-432fe388]  [data-braintree-id=sheet-error]{background-color:#fff}#dropin-container[data-v-432fe388]  .braintree-method .braintree-method__label .braintree-method__label--small,#dropin-container[data-v-432fe388]  .braintree-method__label,#dropin-container[data-v-432fe388]  .braintree-methods--active .braintree-method__label,#dropin-container[data-v-432fe388]  .braintree-option__label{color:#212121;font-weight:300;text-align:left}#dropin-container[data-v-432fe388]  [data-braintree-id=methods-container] .braintree-method--active{background-color:#fafafa;border-color:#4faf4e;border-width:1px}#dropin-container[data-v-432fe388]  [data-braintree-id=methods-container] .braintree-method__check{background-color:#4faf4e;height:1.95rem;margin-right:.25rem;padding:.3125rem;width:1.95rem}#dropin-container[data-v-432fe388]  [data-braintree-id=applePay],#dropin-container[data-v-432fe388]  [data-braintree-id=card],#dropin-container[data-v-432fe388]  [data-braintree-id=googlePay],#dropin-container[data-v-432fe388]  [data-braintree-id=paypal]{border:0}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content.braintree-sheet__content--form{padding:0}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content .braintree-form__field-error{color:#d74937;font-weight:400;text-align:left}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content .braintree-form__field-group{margin-bottom:1.25rem;padding-left:0}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content .braintree-form__field-group.braintree-form__field-group--has-error .braintree-form__hosted-field{background-color:rgba(215,73,55,.15);border-color:#d74937;border-radius:.25rem}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content .braintree-form__field-group:not(.braintree-form__field-group--has-error) .braintree-form__field:not(.braintree-form__checkbox) .braintree-form__hosted-field{background-color:#fafafa;border-color:#757575;border-radius:.25rem;color:#9d9c9e}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content span.braintree-form__descriptor{display:none}#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content [data-braintree-id=cvv-field-group],#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content [data-braintree-id=expiration-date-field-group],#dropin-container[data-v-432fe388]  [data-braintree-id=card] .braintree-sheet__content [data-braintree-id=postal-code-field-group]{-ms-flex-preferred-size:auto;-webkit-box-flex:unset;-ms-flex-positive:unset;flex-basis:auto;flex-grow:unset;width:49%}#dropin-container[data-v-432fe388]  [data-braintree-id=card-view-icons]{padding-bottom:0}#dropin-container[data-v-432fe388]  [data-braintree-id=card-view-icons]>div{border:1px solid #f3f3f3;border-radius:.25rem;line-height:.6875rem;padding:0}#dropin-container[data-v-432fe388]  [data-braintree-id=paypal-button]{width:99%}@media print,screen and (min-width:30.0625em){#dropin-container[data-v-432fe388]  [data-braintree-id=paypal-button]{width:250px}}#dropin-container[data-v-432fe388]  [data-braintree-id=number-field-group]:not(.braintree-form__field-group--card-type-known) svg{display:none}#dropin-container[data-v-432fe388]  iframe[type=number]{background-color:transparent;-webkit-box-shadow:none;box-shadow:none;padding:0}#payment-updating-overlay[data-v-432fe388]{background-color:rgba(255,255,255,.7);z-index:500}.drop-in-wrapper[data-v-432fe388]{text-align:center}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5671:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_1_lang_postcss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5355);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_1_lang_postcss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BraintreeDropInInterface_vue_vue_type_style_index_1_lang_postcss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5672:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".loading-spinner{margin-bottom:1rem}#dropin-container [data-braintree-id=choose-a-way-to-pay],#dropin-container [data-braintree-id=methods-label],#dropin-container [data-braintree-id=other-ways-to-pay]{--tw-text-opacity:1;color:rgba(var(--text-tertiary),var(--tw-text-opacity));font-size:.8125rem;line-height:1.5;width:100%}@media (min-width:64rem){#dropin-container [data-braintree-id=choose-a-way-to-pay],#dropin-container [data-braintree-id=methods-label],#dropin-container [data-braintree-id=other-ways-to-pay]{font-size:.875rem}}#dropin-container [data-braintree-id=sheet-container]{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}#dropin-container [data-braintree-id=apple-pay-sheet-header],#dropin-container [data-braintree-id=card-sheet-header],#dropin-container [data-braintree-id=google-pay-sheet-header],#dropin-container [data-braintree-id=paypal-sheet-header]{background-color:transparent;border-width:0;margin-bottom:.5rem;padding:0 0 .5rem}#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__logo--header,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__logo--header,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__logo--header,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__logo--header{display:none}#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__header-label,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__header-label,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__header-label,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__header-label{width:100%}#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__text{--tw-text-opacity:1;color:rgba(var(--text-primary),var(--tw-text-opacity));font-size:.875rem;font-weight:400;line-height:1.5;margin-left:0;text-align:left;text-transform:uppercase}@media (min-width:45.875rem){#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__text{font-size:.875rem}}@media (min-width:64rem){#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=apple-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=card-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=google-pay-sheet-header] .braintree-sheet__text,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__label,#dropin-container [data-braintree-id=paypal-sheet-header] .braintree-sheet__text{font-size:.875rem}}#dropin-container [data-braintree-id=upper-container]:before{background-color:transparent}#dropin-container [data-braintree-id=methods-container] .braintree-method{--tw-border-opacity:1;border:.0625rem solid rgba(var(--border-tertiary),var(--tw-border-opacity));padding:1rem;width:100%}#dropin-container [data-braintree-id=methods-container] .braintree-method:first-child{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:.875rem;border-top-right-radius:.875rem}#dropin-container [data-braintree-id=methods-container] .braintree-method:last-child{border-bottom-left-radius:.875rem;border-bottom-right-radius:.875rem}#dropin-container [data-braintree-id=payment-options-container] .braintree-option{--tw-border-opacity:1;border:.0625rem solid rgba(var(--border-tertiary),var(--tw-border-opacity));border-bottom-width:0;padding:1rem;width:100%}#dropin-container [data-braintree-id=payment-options-container] .braintree-option:first-child{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:.875rem;border-top-right-radius:.875rem}#dropin-container [data-braintree-id=payment-options-container] .braintree-option:last-child{border-bottom-left-radius:.875rem;border-bottom-right-radius:.875rem;border-bottom-width:.0625rem}#dropin-container [data-braintree-id=toggle],#dropin-container [data-braintree-id=toggle]:hover{background-color:transparent;font-size:.875rem;font-weight:400;line-height:1.5;text-transform:uppercase}@media (min-width:45.875rem){#dropin-container [data-braintree-id=toggle],#dropin-container [data-braintree-id=toggle]:hover{font-size:.875rem}}@media (min-width:64rem){#dropin-container [data-braintree-id=toggle],#dropin-container [data-braintree-id=toggle]:hover{font-size:.875rem}}#dropin-container [data-braintree-id=toggle],#dropin-container [data-braintree-id=toggle]:hover{color:rgb(var(--text-action));text-decoration:none}#dropin-container [data-braintree-id=toggle]:focus,#dropin-container [data-braintree-id=toggle]:hover,#dropin-container [data-braintree-id=toggle]:hover:focus,#dropin-container [data-braintree-id=toggle]:hover:hover{color:rgb(var(--text-action-highlight));text-decoration:underline}#dropin-container [data-braintree-id=toggle] span,#dropin-container [data-braintree-id=toggle] span:focus,#dropin-container [data-braintree-id=toggle] span:hover{border-width:0;font-size:1rem;font-weight:300;letter-spacing:0;line-height:1.5;-webkit-text-decoration-line:none;text-decoration-line:none}@media (min-width:64rem){#dropin-container [data-braintree-id=toggle] span,#dropin-container [data-braintree-id=toggle] span:focus,#dropin-container [data-braintree-id=toggle] span:hover{font-size:1.0625rem;letter-spacing:0}}#dropin-container [data-braintree-id=toggle] span,#dropin-container [data-braintree-id=toggle] span:focus,#dropin-container [data-braintree-id=toggle] span:hover{font-weight:500}#dropin-container [data-braintree-id=card] .braintree-sheet__content .braintree-form__label{font-size:1rem;font-weight:300;letter-spacing:0;line-height:1.5}@media (min-width:64rem){#dropin-container [data-braintree-id=card] .braintree-sheet__content .braintree-form__label{font-size:1.0625rem;letter-spacing:0}}#dropin-container [data-braintree-id=card] .braintree-sheet__content .braintree-form__label{font-weight:500}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5798:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Payment/BraintreeDropInInterface.vue?vue&type=template&id=432fe388&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"drop-in-wrapper"},[_c('div',{staticClass:"data-hj-suppress",attrs:{"id":"dropin-container"}}),_vm._v(" "),(_vm.updatingPaymentWrapper)?_c('kv-loading-spinner'):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Payment/BraintreeDropInInterface.vue?vue&type=template&id=432fe388&scoped=true&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(7);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(11);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./node_modules/lodash/get.js
var get = __webpack_require__(36);
var get_default = /*#__PURE__*/__webpack_require__.n(get);

// EXTERNAL MODULE: ./node_modules/numeral/numeral.js
var numeral = __webpack_require__(5);
var numeral_default = /*#__PURE__*/__webpack_require__.n(numeral);

// EXTERNAL MODULE: ./node_modules/@sentry/core/esm/exports.js + 10 modules
var esm_exports = __webpack_require__(1386);

// EXTERNAL MODULE: ./src/graphql/query/checkout/getClientToken.graphql
var getClientToken_graphql = __webpack_require__(5668);
var getClientToken_graphql_default = /*#__PURE__*/__webpack_require__.n(getClientToken_graphql);

// EXTERNAL MODULE: ./src/components/Kv/KvLoadingSpinner.vue + 2 modules
var KvLoadingSpinner = __webpack_require__(145);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Payment/BraintreeDropInInterface.vue?vue&type=script&lang=js&


function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof_default()(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof_default()(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
//
//
//
//
//
//
//







/**
* Displays the Braintree Drop In Interface
* For reference see:
* https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html
* */
/* harmony default export */ var BraintreeDropInInterfacevue_type_script_lang_js_ = ({
  name: 'BraintreeDropInInterface',
  components: {
    KvLoadingSpinner: KvLoadingSpinner["a" /* default */]
  },
  inject: ['apollo'],
  props: {
    amount: {
      type: String,
      default: ''
    },
    /**
     * Paypal flow options.
     * Must be 'checkout' or 'vault'
    * */
    flow: {
      type: String,
      default: 'checkout',
      validator: function validator(value) {
        // The value must match one of these strings
        return ['checkout', 'vault'].indexOf(value) !== -1;
      }
    },
    /**
     * Preselect Vaulted Payment Method
     * Braintree option to preselect payment method
    * */
    preselectVaultedPaymentMethod: {
      type: Boolean,
      default: true
    },
    /**
     * Payment type options to be displayed.
     * Also controls the order to display them in.
     * All options in default order:
     * ['card', 'paypal', 'paypalCredit', 'venmo', 'applePay', 'googlePay']
    * */
    paymentTypes: {
      type: Array,
      default: function _default() {
        return ['paypal', 'card'];
      },
      validator: function validator(value) {
        var possiblePaymentTypes = ['card', 'paypal', 'paypalCredit', 'venmo', 'applePay', 'googlePay'];
        return value.every(function (elem) {
          return possiblePaymentTypes.includes(elem);
        });
      }
    },
    /**
     * Drop-In auth options
     * Must be 'token-key' or 'client-token'
    * */
    auth: {
      type: String,
      default: 'client-token',
      validator: function validator(value) {
        // The value must match one of these strings
        return ['token-key', 'client-token'].indexOf(value) !== -1;
      }
    }
  },
  data: function data() {
    return {
      btDropinInstance: function btDropinInstance() {},
      clientToken: null,
      updatingPaymentWrapper: false
    };
  },
  computed: {
    formattedAmount: function formattedAmount() {
      return numeral_default()(this.amount).format('0.00');
    },
    applePaymentRequest: function applePaymentRequest() {
      return {
        total: {
          label: 'Kiva',
          amount: this.formattedAmount
        },
        requiredBillingContactFields: ['postalAddress']
      };
    },
    googleTransactionInfo: function googleTransactionInfo() {
      return {
        totalPriceStatus: 'FINAL',
        totalPrice: this.formattedAmount,
        currencyCode: 'USD'
      };
    }
  },
  watch: {
    amount: function amount(next, prev) {
      if (next !== prev) {
        var _this$btDropinInstanc, _this$btDropinInstanc2, _this$btDropinInstanc3, _this$btDropinInstanc4, _this$btDropinInstanc5, _this$btDropinInstanc6;
        (_this$btDropinInstanc = this.btDropinInstance) === null || _this$btDropinInstanc === void 0 || (_this$btDropinInstanc2 = _this$btDropinInstanc.updateConfiguration) === null || _this$btDropinInstanc2 === void 0 || _this$btDropinInstanc2.call(_this$btDropinInstanc, 'paypal', 'amount', this.formattedAmount);
        (_this$btDropinInstanc3 = this.btDropinInstance) === null || _this$btDropinInstanc3 === void 0 || (_this$btDropinInstanc4 = _this$btDropinInstanc3.updateConfiguration) === null || _this$btDropinInstanc4 === void 0 || _this$btDropinInstanc4.call(_this$btDropinInstanc3, 'googlePay', 'transactionInfo', this.googleTransactionInfo);
        (_this$btDropinInstanc5 = this.btDropinInstance) === null || _this$btDropinInstanc5 === void 0 || (_this$btDropinInstanc6 = _this$btDropinInstanc5.updateConfiguration) === null || _this$btDropinInstanc6 === void 0 || _this$btDropinInstanc6.call(_this$btDropinInstanc5, 'applePay', 'paymentRequest', this.applePaymentRequest);
      }
    }
  },
  methods: {
    setUpdatingPaymentWrapper: function setUpdatingPaymentWrapper(state) {
      this.updatingPaymentWrapper = state;
    },
    getDropInAuthToken: function getDropInAuthToken() {
      var _this = this;
      if (this.auth === 'client-token') {
        this.setUpdatingPaymentWrapper(true);
        this.apollo.query({
          query: getClientToken_graphql_default.a,
          variables: {
            amount: this.formattedAmount,
            useCustomerId: true
          }
        }).then(function (response) {
          if (response.errors) {
            _this.setUpdatingPaymentWrapper(false);
            console.error(response.errors);
            var errorCode = get_default()(response, 'errors[0].code');
            var errorMessage = get_default()(response, 'errors[0].message');
            esm_exports["d" /* withScope */](function (scope) {
              scope.setTag('bt_stage_dropin', 'btGetClientTokenError');
              scope.setTag('bt_get_client_token_error', errorMessage);
              esm_exports["a" /* captureException */](errorCode);
            });
            _this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
          } else {
            _this.clientToken = get_default()(response, 'data.shop.getClientToken');
            _this.initializeDropIn(_this.clientToken);
          }
        }).catch(function (error) {
          console.error(error);
          _this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
        });
      }
      if (this.auth === 'token-key') {
        this.initializeDropIn(this.$appConfig.btTokenKey);
      }
    },
    initializeDropIn: function initializeDropIn(authToken) {
      var _this2 = this;
      return asyncToGenerator_default()( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _yield$import, Dropin;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return __webpack_require__.e(/* import() */ 9).then(__webpack_require__.t.bind(null, 5775, 7));
            case 2:
              _yield$import = _context.sent;
              Dropin = _yield$import.default;
              // Replace our loader with the dropIn loader after a small delay
              setTimeout(function () {
                return _this2.setUpdatingPaymentWrapper(false);
              }, 500);
              Dropin.create({
                authorization: authToken,
                container: '#dropin-container',
                dataCollector: {
                  kount: true // Required if Kount fraud data collection is enabled
                },
                // vaultManager: true, - Useful for testing and removing payment methods easily.
                paymentOptionPriority: _this2.paymentTypes,
                preselectVaultedPaymentMethod: _this2.preselectVaultedPaymentMethod,
                card: {
                  vault: {
                    allowVaultCardOverride: true
                  }
                },
                paypal: {
                  flow: _this2.flow,
                  amount: _this2.formattedAmount,
                  currency: 'USD',
                  buttonStyle: {
                    color: 'gold',
                    shape: 'rect',
                    size: 'responsive'
                  }
                },
                googlePay: {
                  googlePayVersion: 2,
                  merchantId: _this2.$appConfig.googlePay.merchantId,
                  transactionInfo: _this2.googleTransactionInfo,
                  allowedPaymentMethods: [{
                    type: 'CARD',
                    parameters: {
                      billingAddressRequired: true,
                      billingAddressParameters: {
                        format: 'FULL'
                      }
                    }
                  }]
                },
                applePay: {
                  displayName: 'Kiva',
                  paymentRequest: _this2.applePaymentRequest
                }
              }).then(function (btCreateInstance) {
                _this2.btDropinInstance = btCreateInstance;
                _this2.initializeDropInActions();
              }).catch(function (btCreateError) {
                console.error(btCreateError);
                esm_exports["d" /* withScope */](function (scope) {
                  scope.setTag('bt_stage_dropin', 'btCreateError');
                  scope.setTag('bt_client_create_error', btCreateError.message);
                  esm_exports["a" /* captureException */](btCreateError.code);
                });
                _this2.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
              });
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    initializeDropInActions: function initializeDropInActions() {
      var _this3 = this;
      // more info: https://developers.braintreepayments.com/guides/drop-in/customization/javascript/v3#events
      // https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#on

      // initial check for a "requestable" vaulted payment method
      if (this.btDropinInstance.isPaymentMethodRequestable()) {
        this.$emit('transactions-enabled', true);
      }

      // listen for "requestable" payment method (ex. completing PayPal signin)
      // eslint-disable-next-line no-unused-vars
      this.btDropinInstance.on('paymentMethodRequestable', function (event) {
        // Returns event object { paymentMethodIsSelected, type}
        // TODO: add additional check for Postal Code validation during during new card input
        // From the Docs:
        // - If your Drop-in integration has the postal code field,
        // - it will be considered valid after 3 characters
        // - (some international postal codes are 3 characters in length).
        _this3.$emit('transactions-enabled', true);
      });

      // listen for "non-requestable" payment method (ex. PayPal sign in flow)
      this.btDropinInstance.on('noPaymentMethodRequestable', function () {
        // Returns nothing
        _this3.$emit('transactions-enabled', false);
      });

      // listen for "selected" payment option (ex. completion of PayPal sign in)
      // could be useful later
      // this.btDropinInstance.on('paymentOptionSelected', event => {
      // 	console.log('payment option selected - returns option');
      // 	console.log(event);
      // });
    }
  },
  mounted: function mounted() {
    var _document;
    // Prevents BT error in the case this component gets initialized multiple times
    var isElementEmpty = ((_document = document) === null || _document === void 0 || (_document = _document.getElementById('dropin-container')) === null || _document === void 0 ? void 0 : _document.innerHTML) === '';
    if (isElementEmpty) {
      this.getDropInAuthToken();
    }
  }
});
// CONCATENATED MODULE: ./src/components/Payment/BraintreeDropInInterface.vue?vue&type=script&lang=js&
 /* harmony default export */ var Payment_BraintreeDropInInterfacevue_type_script_lang_js_ = (BraintreeDropInInterfacevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Payment/BraintreeDropInInterface.vue?vue&type=style&index=0&id=432fe388&lang=scss&scoped=true&
var BraintreeDropInInterfacevue_type_style_index_0_id_432fe388_lang_scss_scoped_true_ = __webpack_require__(5669);

// EXTERNAL MODULE: ./src/components/Payment/BraintreeDropInInterface.vue?vue&type=style&index=1&lang=postcss&
var BraintreeDropInInterfacevue_type_style_index_1_lang_postcss_ = __webpack_require__(5671);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Payment/BraintreeDropInInterface.vue







/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Payment_BraintreeDropInInterfacevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "432fe388",
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var BraintreeDropInInterface = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"BraintreeDropInInterface","description":"Displays the Braintree Drop In Interface\nFor reference see:\nhttps://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html","tags":{},"exportName":"default","props":[{"name":"amount","type":{"name":"string"},"defaultValue":{"func":false,"value":"''"}},{"name":"flow","description":"Paypal flow options.\nMust be 'checkout' or 'vault'","type":{"name":"string"},"defaultValue":{"func":false,"value":"'checkout'"},"values":["checkout","vault"]},{"name":"preselectVaultedPaymentMethod","description":"Preselect Vaulted Payment Method\nBraintree option to preselect payment method","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"true"}},{"name":"paymentTypes","description":"Payment type options to be displayed.\nAlso controls the order to display them in.\nAll options in default order:\n['card', 'paypal', 'paypalCredit', 'venmo', 'applePay', 'googlePay']","type":{"name":"array"},"defaultValue":{"func":false,"value":"['paypal', 'card']"}},{"name":"auth","description":"Drop-In auth options\nMust be 'token-key' or 'client-token'","type":{"name":"string"},"defaultValue":{"func":false,"value":"'client-token'"},"values":["token-key","client-token"]}],"events":[{"name":"transactions-enabled","type":{"names":["undefined"]}}]}

/***/ })

}]);