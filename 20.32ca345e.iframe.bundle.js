(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ 5012:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(989),
    isArrayLike = __webpack_require__(387),
    isIndex = __webpack_require__(991),
    isObject = __webpack_require__(333);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),

/***/ 5113:
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(2468),
    baseOrderBy = __webpack_require__(2487),
    baseRest = __webpack_require__(2465),
    isIterateeCall = __webpack_require__(5012);

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 30 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;


/***/ }),

/***/ 5288:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5562);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("2dd28fbc", content, true, {});

/***/ }),

/***/ 5289:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5564);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(7).default
var update = add("4c44bf6e", content, true, {});

/***/ }),

/***/ 5559:
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"lendMenuData"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lend"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loanChannels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"popular"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"applyMinLoanCount"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"values"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]}}]}}]}}],"loc":{"start":0,"end":147}};
    doc.loc.source = {"body":"query lendMenuData {\n\tlend {\n\t\tloanChannels(popular: true, applyMinLoanCount: true, limit: 50) {\n\t\t\tvalues {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

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
    
        module.exports["lendMenuData"] = oneQuery(doc, "lendMenuData");
        


/***/ }),

/***/ 5560:
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"lendMenuPrivateData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lend"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lenderFavorite"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"},"arguments":[],"directives":[]}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"my"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"savedSearches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"values"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]}}]}}]}}],"loc":{"start":0,"end":224}};
    doc.loc.source = {"body":"query lendMenuPrivateData($userId: Int) {\n\tlend {\n\t\tloans(limit: 1, filters: {\n\t\t\tlenderFavorite: $userId\n\t\t}) {\n\t\t\ttotalCount\n\t\t}\n\t}\n\tmy {\n\t\tid\n\t\tsavedSearches(limit: 10) {\n\t\t\tvalues {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\turl\n\t\t\t}\n\t\t}\n\t}\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

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
    
        module.exports["lendMenuPrivateData"] = oneQuery(doc, "lendMenuPrivateData");
        


/***/ }),

/***/ 5561:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendListMenu_vue_vue_type_style_index_0_id_9e16d52e_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5288);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendListMenu_vue_vue_type_style_index_0_id_9e16d52e_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendListMenu_vue_vue_type_style_index_0_id_9e16d52e_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5562:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".lend-link[data-v-9e16d52e]{--tw-text-opacity:1;color:rgba(var(--text-primary),var(--tw-text-opacity));display:block;padding-bottom:.5rem;padding-top:.5rem;width:100%}.lend-link[data-v-9e16d52e]:hover{--tw-text-opacity:1;color:rgba(var(--text-action-highlight),var(--tw-text-opacity))}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5563:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendMegaMenu_vue_vue_type_style_index_0_id_4c6ff2a2_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5289);
/* harmony import */ var _node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendMegaMenu_vue_vue_type_style_index_0_id_4c6ff2a2_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_docgen_loader_lib_index_js_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_LendMegaMenu_vue_vue_type_style_index_0_id_4c6ff2a2_lang_postcss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ 5564:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".region-list[data-v-4c6ff2a2],.search-list[data-v-4c6ff2a2]{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-fill:auto;-moz-column-fill:auto;column-fill:auto;gap:2rem}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 5746:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/TheLendMenu.vue?vue&type=template&id=154fe2a0&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('lend-list-menu',{ref:"list",staticClass:"lg:tw-hidden",attrs:{"categories":_vm.computedCategories,"regions":_vm.regions,"searches":_vm.savedSearches,"favorites":_vm.favoritesCount,"user-id":_vm.userId,"is-regions-loading":_vm.isRegionsLoading,"is-channels-loading":_vm.isChannelsLoading,"show-m-g-upsell-link":_vm.showMGUpsellLink}}),_vm._v(" "),_c('lend-mega-menu',{ref:"mega",staticClass:"tw-hidden lg:tw-block",attrs:{"categories":_vm.computedCategories,"regions":_vm.regions,"searches":_vm.savedSearches,"favorites":_vm.favoritesCount,"user-id":_vm.userId,"is-regions-loading":_vm.isRegionsLoading,"is-channels-loading":_vm.isChannelsLoading,"show-m-g-upsell-link":_vm.showMGUpsellLink}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/TheLendMenu.vue?vue&type=template&id=154fe2a0&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(9);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(8);
var taggedTemplateLiteral_default = /*#__PURE__*/__webpack_require__.n(taggedTemplateLiteral);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(5);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/lodash/get.js
var get = __webpack_require__(35);
var get_default = /*#__PURE__*/__webpack_require__.n(get);

// EXTERNAL MODULE: ./node_modules/lodash/groupBy.js
var groupBy = __webpack_require__(916);
var groupBy_default = /*#__PURE__*/__webpack_require__.n(groupBy);

// EXTERNAL MODULE: ./node_modules/lodash/map.js
var map = __webpack_require__(297);
var map_default = /*#__PURE__*/__webpack_require__.n(map);

// EXTERNAL MODULE: ./node_modules/lodash/sortBy.js
var sortBy = __webpack_require__(5113);
var sortBy_default = /*#__PURE__*/__webpack_require__.n(sortBy);

// EXTERNAL MODULE: ./node_modules/graphql-tag/lib/index.js + 20 modules
var lib = __webpack_require__(4247);

// EXTERNAL MODULE: ./src/util/comparators.js
var comparators = __webpack_require__(373);

// EXTERNAL MODULE: ./src/graphql/query/lendMenuData.graphql
var lendMenuData_graphql = __webpack_require__(5559);
var lendMenuData_graphql_default = /*#__PURE__*/__webpack_require__.n(lendMenuData_graphql);

// EXTERNAL MODULE: ./src/graphql/query/lendMenuPrivateData.graphql
var lendMenuPrivateData_graphql = __webpack_require__(5560);
var lendMenuPrivateData_graphql_default = /*#__PURE__*/__webpack_require__.n(lendMenuPrivateData_graphql);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/LendListMenu.vue?vue&type=template&id=9e16d52e&scoped=true&
var LendListMenuvue_type_template_id_9e16d52e_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tw-pb-2"},[(_vm.showMGUpsellLink)?_c('router-link',{attrs:{"to":"/monthlygood"},nativeOn:{"click":function($event){return _vm.trackMgLinkClick.apply(null, arguments)}}},[_c('span',{staticClass:"tw-inline-flex tw-items-center tw-py-2 tw-mb-2 tw-gap-0.5 tw-border-b tw-border-tertiary tw-font-medium"},[_vm._v("\n\t\t\tLend monthly\n\t\t\t"),_c('kv-material-icon',{staticClass:"tw-w-3 tw-h-3",attrs:{"icon":_vm.mdiArrowRight}})],1)]):_c('div',{staticClass:"tw-block tw-py-2 tw-mb-2 tw-w-16"},[_c('kv-loading-placeholder',{staticStyle:{"height":"1.5rem"}})],1),_vm._v(" "),_c('kv-tabs',{ref:"navLendCategories",scopedSlots:_vm._u([{key:"tabNav",fn:function(){return [_c('kv-tab',{attrs:{"for-panel":"nav-lend-categories"}},[_vm._v("\n\t\t\t\tCategories\n\t\t\t")]),_vm._v(" "),_c('kv-tab',{attrs:{"for-panel":"nav-lend-regions"}},[_vm._v("\n\t\t\t\tRegions\n\t\t\t")]),_vm._v(" "),(_vm.userId)?_c('kv-tab',{attrs:{"for-panel":"nav-my-kiva"}},[_vm._v("\n\t\t\t\tMy Kiva\n\t\t\t")]):_vm._e()]},proxy:true},{key:"tabPanels",fn:function(){return [_c('kv-tab-panel',{attrs:{"id":"nav-lend-categories"}},[_c('ul',{staticClass:"tw-font-medium"},[(_vm.isChannelsLoading)?_vm._l((14),function(i){return _c('li',{key:i,staticClass:"tw-w-[11rem] tw-py-1 tw-flex"},[_c('kv-loading-placeholder',{staticClass:"tw-inline-block tw-align-middle",staticStyle:{"height":"1rem","display":"inline-block"}}),_vm._v(" "),_c('span',{staticClass:"tw-inline-block"},[_vm._v(" ")])],1)}):_vm._l((_vm.categories),function(category,index){return _c('li',{key:index},[_c('a',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav', 'click-Lend-Category', category.name, index + 1]),expression:"['TopNav', 'click-Lend-Category', category.name, index + 1]"}],staticClass:"lend-link",attrs:{"href":category.url}},[_vm._v("\n\t\t\t\t\t\t\t\t"+_vm._s(category.name)+"\n\t\t\t\t\t\t\t")])])}),_vm._v(" "),_c('li',{staticClass:"tw-border-t tw-border-tertiary"},[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Recommended-by-lenders']),expression:"['TopNav','click-Lend-Recommended-by-lenders']"}],staticClass:"lend-link tw-text-brand",attrs:{"to":"/lend-by-category/recommended-by-lenders"}},[_vm._v("\n\t\t\t\t\t\t\tRecommended by lenders\n\t\t\t\t\t\t")])],1),_vm._v(" "),_c('li',[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-All_Loans']),expression:"['TopNav','click-Lend-All_Loans']"}],staticClass:"lend-link",attrs:{"to":"/lend"}},[_vm._v("\n\t\t\t\t\t\t\tAll loans\n\t\t\t\t\t\t")])],1),_vm._v(" "),_c('li',[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-All_Categories']),expression:"['TopNav','click-Lend-All_Categories']"}],staticClass:"lend-link",attrs:{"to":"/categories"}},[_vm._v("\n\t\t\t\t\t\t\tAll categories\n\t\t\t\t\t\t")])],1)],2)]),_vm._v(" "),_c('kv-tab-panel',{attrs:{"id":"nav-lend-regions"}},[(_vm.isRegionsLoading)?_vm._l((8),function(i){return _c('kv-accordion-item',{key:i,attrs:{"id":_vm._f("changeCase")(("placeholder-" + i + "-panel"),'paramCase'),"disabled":true},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('div',{staticClass:"tw-flex"},[_c('kv-loading-placeholder',{staticClass:"tw-inline-block tw-align-middle",staticStyle:{"height":"1rem","display":"inline-block"}}),_vm._v(" "),_c('span',{staticClass:"tw-inline-block tw-text-h4"},[_vm._v(" ")])],1)]},proxy:true}],null,true)})}):_vm._l((_vm.regions),function(region){return _c('kv-accordion-item',{key:region.name,ref:"regionAccordions",refInFor:true,attrs:{"id":_vm._f("changeCase")(("lend-menu-" + (region.name) + "-panel"),'paramCase')},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"tw-text-h4"},[_c('span',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Region', region.name]),expression:"['TopNav','click-Lend-Region', region.name]"}]},[_vm._v("\n\t\t\t\t\t\t\t\t\t"+_vm._s(region.name)+"\n\t\t\t\t\t\t\t\t")])])]},proxy:true}],null,true)},[_vm._v(" "),_c('country-list',{attrs:{"countries":region.countries}})],1)})],2),_vm._v(" "),(_vm.userId)?_c('kv-tab-panel',{attrs:{"id":"nav-my-kiva"}},[_c('ul',{staticClass:"tw-font-medium"},[_c('li',[(_vm.favorites > 0)?_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Favorites']),expression:"['TopNav','click-Lend-Favorites']"}],staticClass:"lend-link",attrs:{"to":{ path: '/lend', query: { lenderFavorite: _vm.userId } }}},[_vm._v("\n\t\t\t\t\t\t\tSaved loans\n\t\t\t\t\t\t")]):_c('span',{staticClass:"tw-block tw-py-1 tw-text-tertiary"},[_vm._v("Saved loans")])],1),_vm._v(" "),(_vm.hasSearches)?_c('li',[_c('kv-accordion-item',{ref:"searches",attrs:{"id":"lend-menu-saved-searches-panel"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('p',{staticClass:"tw-font-medium"},[_vm._v("\n\t\t\t\t\t\t\t\t\tSaved searches\n\t\t\t\t\t\t\t\t")])]},proxy:true}],null,false,145263771)},[_vm._v(" "),_c('search-list',{attrs:{"searches":_vm.searches}})],1)],1):_c('li',[_c('span',{staticClass:"tw-block tw-py-1 tw-text-tertiary"},[_vm._v("Saved searches")])]),_vm._v(" "),_c('li',[_c('a',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Countries_Not_Lent']),expression:"['TopNav','click-Lend-Countries_Not_Lent']"}],staticClass:"lend-link",attrs:{"href":"/lend/countries-not-lent"}},[_vm._v("\n\t\t\t\t\t\t\tCountries I haven't lent to\n\t\t\t\t\t\t")])])])]):_vm._e()]},proxy:true}])})],1)}
var LendListMenuvue_type_template_id_9e16d52e_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendListMenu.vue?vue&type=template&id=9e16d52e&scoped=true&

// EXTERNAL MODULE: ./src/components/Kv/KvAccordionItem.vue + 4 modules
var KvAccordionItem = __webpack_require__(517);

// EXTERNAL MODULE: ./node_modules/@mdi/js/mdi.js
var mdi = __webpack_require__(11);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvLoadingPlaceholder.vue + 2 modules
var KvLoadingPlaceholder = __webpack_require__(41);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/SearchList.vue?vue&type=template&id=08281604&
var SearchListvue_type_template_id_08281604_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"tw-font-medium"},[_vm._l((_vm.searches),function(search){return _c('li',{key:search.id},[_c('a',{staticClass:"tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1",attrs:{"href":search.url}},[_vm._v(_vm._s(search.name))])])}),_vm._v(" "),_c('li',[_c('router-link',{staticClass:"tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1",attrs:{"to":"/lend/saved-search"}},[_vm._v("\n\t\t\tManage saved searches\n\t\t")])],1)],2)}
var SearchListvue_type_template_id_08281604_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/SearchList.vue?vue&type=template&id=08281604&

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/SearchList.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var SearchListvue_type_script_lang_js_ = ({
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/SearchList.vue?vue&type=script&lang=js&
 /* harmony default export */ var LendMenu_SearchListvue_type_script_lang_js_ = (SearchListvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/SearchList.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  LendMenu_SearchListvue_type_script_lang_js_,
  SearchListvue_type_template_id_08281604_render,
  SearchListvue_type_template_id_08281604_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var SearchList = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"SearchList","exportName":"default","description":"","tags":{},"props":[{"name":"searches","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/CountryList.vue?vue&type=template&id=3e269938&
var CountryListvue_type_template_id_3e269938_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"tw-whitespace-nowrap tw-font-medium"},_vm._l((_vm.countries),function(country){return _c('li',{key:country.isoCode,staticClass:"lg:tw-w-[11rem]"},[(country.count > 0)?_c('a',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav', 'click-Lend-Country', country.name]),expression:"['TopNav', 'click-Lend-Country', country.name]"}],staticClass:"tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1",attrs:{"href":("/lend/filter?country=" + (country.isoCode))}},[_vm._v("\n\t\t\t"+_vm._s(country.name)+" ("+_vm._s(country.count)+")\n\t\t")]):_c('span',{staticClass:"tw-block tw-py-1 tw-text-tertiary"},[_vm._v("\n\t\t\t"+_vm._s(country.name)+" (0)\n\t\t")])])}),0)}
var CountryListvue_type_template_id_3e269938_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/CountryList.vue?vue&type=template&id=3e269938&

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/CountryList.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var CountryListvue_type_script_lang_js_ = ({
  name: 'CountryList',
  props: {
    countries: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/CountryList.vue?vue&type=script&lang=js&
 /* harmony default export */ var LendMenu_CountryListvue_type_script_lang_js_ = (CountryListvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/CountryList.vue





/* normalize component */

var CountryList_component = Object(componentNormalizer["a" /* default */])(
  LendMenu_CountryListvue_type_script_lang_js_,
  CountryListvue_type_template_id_3e269938_render,
  CountryListvue_type_template_id_3e269938_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const CountryList_vuedocgen_export_0 = CountryList_component.exports;
/* harmony default export */ var CountryList = (CountryList_vuedocgen_export_0);
CountryList_vuedocgen_export_0.__docgenInfo = {"displayName":"CountryList","exportName":"default","description":"","tags":{},"props":[{"name":"countries","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}}]}
// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvMaterialIcon.vue + 4 modules
var KvMaterialIcon = __webpack_require__(14);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvTab.vue + 4 modules
var KvTab = __webpack_require__(933);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvTabPanel.vue + 4 modules
var KvTabPanel = __webpack_require__(2378);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvTabs.vue + 4 modules
var KvTabs = __webpack_require__(934);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/LendListMenu.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ var LendListMenuvue_type_script_lang_js_ = ({
  name: 'LendListMenu',
  inject: ['apollo', 'cookieStore'],
  components: {
    CountryList: CountryList,
    KvAccordionItem: KvAccordionItem["a" /* default */],
    KvMaterialIcon: KvMaterialIcon["a" /* default */],
    KvTab: KvTab["a" /* default */],
    KvTabPanel: KvTabPanel["a" /* default */],
    KvTabs: KvTabs["a" /* default */],
    KvLoadingPlaceholder: KvLoadingPlaceholder["a" /* default */],
    SearchList: SearchList
  },
  props: {
    categories: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    favorites: {
      type: Number,
      default: 0
    },
    userId: {
      type: Number,
      default: null
    },
    regions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    searches: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    isRegionsLoading: {
      type: Boolean,
      default: true
    },
    isChannelsLoading: {
      type: Boolean,
      default: true
    },
    showMGUpsellLink: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      mgHighlightInNavVersion: null,
      mdiArrowRight: mdi["c" /* mdiArrowRight */]
    };
  },
  computed: {
    hasSearches: function hasSearches() {
      return this.searches.length > 0;
    }
  },
  methods: {
    onClose: function onClose() {
      var _this$$refs, _this$$refs$navLendCa, _this$$refs$navLendCa2, _this$$refs2, _this$$refs3;

      // reset the tabs
      if ((_this$$refs = this.$refs) !== null && _this$$refs !== void 0 && (_this$$refs$navLendCa = _this$$refs.navLendCategories) !== null && _this$$refs$navLendCa !== void 0 && (_this$$refs$navLendCa2 = _this$$refs$navLendCa.tabContext) !== null && _this$$refs$navLendCa2 !== void 0 && _this$$refs$navLendCa2.setTab) {
        var _this$$refs$navLendCa3;

        (_this$$refs$navLendCa3 = this.$refs.navLendCategories.tabContext) === null || _this$$refs$navLendCa3 === void 0 ? void 0 : _this$$refs$navLendCa3.setTab(0);
      } // close all region accordions


      if ((_this$$refs2 = this.$refs) !== null && _this$$refs2 !== void 0 && _this$$refs2.regionAccordions) {
        this.$refs.regionAccordions.forEach(function (accordionRef) {
          accordionRef.collapse();
        });
      } // close saved search accordions


      if (this.hasSearches && (_this$$refs3 = this.$refs) !== null && _this$$refs3 !== void 0 && _this$$refs3.searches) {
        this.$refs.searches.collapse();
      }
    },
    trackMgLinkClick: function trackMgLinkClick() {
      this.$kvTrackEvent('TopNav', 'click-Lend-Menu-Monthly-Good', 'Lend-monthly');
    }
  }
});
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendListMenu.vue?vue&type=script&lang=js&
 /* harmony default export */ var LendMenu_LendListMenuvue_type_script_lang_js_ = (LendListMenuvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/WwwFrame/LendMenu/LendListMenu.vue?vue&type=style&index=0&id=9e16d52e&lang=postcss&scoped=true&
var LendListMenuvue_type_style_index_0_id_9e16d52e_lang_postcss_scoped_true_ = __webpack_require__(5561);

// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendListMenu.vue






/* normalize component */

var LendListMenu_component = Object(componentNormalizer["a" /* default */])(
  LendMenu_LendListMenuvue_type_script_lang_js_,
  LendListMenuvue_type_template_id_9e16d52e_scoped_true_render,
  LendListMenuvue_type_template_id_9e16d52e_scoped_true_staticRenderFns,
  false,
  null,
  "9e16d52e",
  null
  
)

const LendListMenu_vuedocgen_export_0 = LendListMenu_component.exports;
/* harmony default export */ var LendListMenu = (LendListMenu_vuedocgen_export_0);
LendListMenu_vuedocgen_export_0.__docgenInfo = {"displayName":"LendListMenu","exportName":"default","description":"","tags":{},"props":[{"name":"categories","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"favorites","type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}},{"name":"userId","type":{"name":"number"},"defaultValue":{"func":false,"value":"null"}},{"name":"regions","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"searches","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"isRegionsLoading","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"true"}},{"name":"isChannelsLoading","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"true"}},{"name":"showMGUpsellLink","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/LendMegaMenu.vue?vue&type=template&id=4c6ff2a2&scoped=true&
var LendMegaMenuvue_type_template_id_4c6ff2a2_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"lend-mega-menu tw-overflow-hidden tw-pb-3 lg:tw-pt-3"},[(_vm.showMGUpsellLink)?_c('router-link',{attrs:{"to":"/monthlygood"},nativeOn:{"click":function($event){return _vm.trackMgLinkClick.apply(null, arguments)}}},[_c('span',{staticClass:"tw-inline-flex tw-items-center tw-py-2 tw-mb-2 tw-gap-0.5 tw-font-medium"},[_vm._v("\n\t\t\tLend monthly\n\t\t\t"),_c('kv-material-icon',{staticClass:"tw-w-3 tw-h-3",attrs:{"icon":_vm.mdiArrowRight}})],1)]):_c('div',{staticClass:"tw-block tw-py-2 tw-mb-2 tw-w-16"},[_c('kv-loading-placeholder',{staticStyle:{"height":"1.5rem"}})],1),_vm._v(" "),_c('div',{staticClass:"tw-transition tw-duration-1000 tw-ease-in-out",style:(_vm.computedStyle)},[_c('kv-grid',{staticStyle:{"grid-template-columns":"repeat(18, minmax(0, 1fr))"}},[_c('div',{ref:"categories",staticClass:"tw-col-span-7"},[_c('h2',{staticClass:"tw-text-base tw-mb-2"},[_vm._v("\n\t\t\t\t\tCategories\n\t\t\t\t")]),_vm._v(" "),_c('div',{staticClass:"tw-flex tw-gap-4 tw-whitespace-nowrap"},[_c('ul',{staticClass:"tw-columns-2 tw-gap-4 tw-font-medium"},[(_vm.isChannelsLoading)?_vm._l((14),function(i){return _c('li',{key:i,staticClass:"tw-w-[11rem]"},[_c('kv-loading-placeholder',{staticClass:"tw-inline-block tw-align-middle",staticStyle:{"height":"1.25rem"}}),_vm._v(" "),_c('span',{staticClass:"tw-py-1 tw-inline-block"},[_vm._v(" ")])],1)}):_vm._l((_vm.categories),function(category,index){return _c('li',{key:index,staticClass:"tw-w-[11rem]"},[_c('a',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav', 'click-Lend-Category', category.name, index + 1]),expression:"['TopNav', 'click-Lend-Category', category.name, index + 1]"}],staticClass:"tw-text-primary tw-text-left hover:tw-text-action-highlight\n\t\t\t\t\t\t\t\ttw-py-1 tw-inline-block",attrs:{"href":category.url}},[_vm._v("\n\t\t\t\t\t\t\t\t\t"+_vm._s(category.name)+"\n\t\t\t\t\t\t\t\t")])])})],2),_vm._v(" "),_c('div',[_c('ul',{staticClass:"tw-font-medium"},[_c('li',{staticClass:"tw-w-[11rem]"},[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Recommended-by-lenders']),expression:"['TopNav','click-Lend-Recommended-by-lenders']"}],staticClass:"tw-text-action hover:tw-text-action-highlight tw-inline-block tw-py-1",attrs:{"to":"/lend-by-category/recommended-by-lenders"}},[_vm._v("\n\t\t\t\t\t\t\t\t\tRecommended by lenders\n\t\t\t\t\t\t\t\t")])],1),_vm._v(" "),_c('li',{staticClass:"tw-w-[11rem]"},[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-All_Categories']),expression:"['TopNav','click-Lend-All_Categories']"}],staticClass:"tw-text-primary hover:tw-text-action-highlight tw-inline-block tw-py-1",attrs:{"to":"/categories"}},[_vm._v("\n\t\t\t\t\t\t\t\t\tAll categories\n\t\t\t\t\t\t\t\t")])],1),_vm._v(" "),_c('li',{ref:"allLoans",staticClass:"tw-w-[11rem]"},[_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-All_Loans']),expression:"['TopNav','click-Lend-All_Loans']"}],staticClass:"tw-text-primary hover:tw-text-action-highlight tw-inline-block tw-py-1",attrs:{"to":"/lend"}},[_vm._v("\n\t\t\t\t\t\t\t\t\tAll loans\n\t\t\t\t\t\t\t\t")])],1)]),_vm._v(" "),(_vm.userId)?_c('div',[_c('span',{staticClass:"tw-inline-block tw-py-1"},[_vm._v(" ")]),_vm._v(" "),_c('h2',{staticClass:"tw-text-base tw-my-1"},[_vm._v("\n\t\t\t\t\t\t\t\tMy Kiva\n\t\t\t\t\t\t\t")]),_vm._v(" "),_c('ul',{staticClass:"tw-font-medium"},[_c('li',[(_vm.favorites > 0)?_c('router-link',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Favorites']),expression:"['TopNav','click-Lend-Favorites']"}],staticClass:"tw-text-primary tw-text-left hover:tw-text-action-highlight\n\t\t\t\t\t\t\t\t\t\t\ttw-py-1 tw-inline-block",attrs:{"to":{ path: '/lend', query: { lenderFavorite: _vm.userId } }}},[_vm._v("\n\t\t\t\t\t\t\t\t\t\tSaved loans\n\t\t\t\t\t\t\t\t\t")]):_c('span',{staticClass:"tw-text-secondary tw-py-1 tw-inline-block"},[_vm._v("\n\t\t\t\t\t\t\t\t\t\tSaved loans\n\t\t\t\t\t\t\t\t\t")])],1),_vm._v(" "),_c('li',[(_vm.hasSearches)?_c('button',{staticClass:"tw-text-primary tw-text-left tw-py-1 tw-inline-block\n\t\t\t\t\t\t\t\t\t\thover:tw-text-action-highlight hover:tw-underline",attrs:{"aria-pressed":_vm.isOpenSection(_vm.savedSearchesTitle) ? 'true' : 'false'},on:{"click":function($event){return _vm.openSection(_vm.savedSearchesTitle)}}},[_vm._v("\n\t\t\t\t\t\t\t\t\t\t"+_vm._s(_vm.savedSearchesTitle)+"\n\t\t\t\t\t\t\t\t\t")]):_c('span',{staticClass:"tw-text-secondary tw-py-1 tw-inline-block"},[_vm._v("\n\t\t\t\t\t\t\t\t\t\tSaved searches\n\t\t\t\t\t\t\t\t\t")])]),_vm._v(" "),_c('li',[_c('a',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Countries_Not_Lent']),expression:"['TopNav','click-Lend-Countries_Not_Lent']"}],staticClass:"tw-text-primary tw-text-left hover:tw-text-action-highlight\n\t\t\t\t\t\t\t\t\t\t\ttw-py-1 tw-inline-block",attrs:{"href":"/lend/countries-not-lent"}},[_vm._v("\n\t\t\t\t\t\t\t\t\t\tCountries I haven't lent to\n\t\t\t\t\t\t\t\t\t")])])])]):_vm._e()])])]),_vm._v(" "),_c('div',{staticClass:"tw-col-span-2"},[(_vm.sectionOpen)?_c('button',{staticClass:"tw-flex",on:{"click":function($event){_vm.openedSection = ''}}},[_c('kv-material-icon',{staticClass:"tw-flex-shrink-0 tw-w-3 tw-h-3",attrs:{"icon":_vm.mdiChevronLeft}}),_vm._v(" "),_c('span',{staticClass:"tw-text-base"},[_vm._v("\n\t\t\t\t\t\tBack\n\t\t\t\t\t")])],1):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"tw-col-span-8 tw-flex tw-flex-col"},[(_vm.isOpenSection(_vm.savedSearchesTitle))?[_c('h2',{staticClass:"tw-text-base tw-mb-2"},[_vm._v("\n\t\t\t\t\t\tSaved Searches\n\t\t\t\t\t")]),_vm._v(" "),_c('search-list',{staticClass:"search-list tw-h-full",attrs:{"searches":_vm.searches}})]:[_c('h2',{staticClass:"tw-text-base tw-mb-2"},[_vm._v("\n\t\t\t\t\t\tRegions\n\t\t\t\t\t")]),_vm._v(" "),_c('div',{staticClass:"tw-flex tw-whitespace-nowrap tw-h-full"},[_c('ul',{staticClass:"tw-font-medium"},[(_vm.isRegionsLoading)?_vm._l((8),function(i){return _c('li',{key:i,staticClass:"tw-w-[11rem]"},[_c('kv-loading-placeholder',{staticClass:"tw-inline-block tw-align-middle",staticStyle:{"height":"1.25rem"}}),_vm._v(" "),_c('span',{staticClass:"tw-py-1 tw-inline-block"},[_vm._v(" ")])],1)}):_vm._l((_vm.regions),function(region){return _c('li',{key:region.name,staticClass:"tw-w-[11rem] tw-mr-4"},[_c('button',{directives:[{name:"kv-track-event",rawName:"v-kv-track-event",value:(['TopNav','click-Lend-Region', region.name]),expression:"['TopNav','click-Lend-Region', region.name]"}],staticClass:"tw-text-primary tw-text-left tw-py-1\n\t\t\t\t\t\t\t\t\t\thover:tw-text-action-highlight hover:tw-underline ",class:{ 'tw-text-action' : _vm.isOpenSection(region.name)},attrs:{"aria-pressed":_vm.isOpenSection(region.name) ? 'true' : 'false'},on:{"click":function($event){return _vm.openSection(region.name)}}},[_vm._v("\n\t\t\t\t\t\t\t\t\t\t"+_vm._s(region.name)+"\n\t\t\t\t\t\t\t\t\t")])])})],2),_vm._v(" "),_vm._l((_vm.openRegions),function(region){return _c('div',{key:region.name,staticClass:"tw-h-full"},[_c('country-list',{staticClass:"region-list tw-h-full",attrs:{"countries":region.countries}})],1)})],2)]],2)])],1)],1)}
var LendMegaMenuvue_type_template_id_4c6ff2a2_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendMegaMenu.vue?vue&type=template&id=4c6ff2a2&scoped=true&

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvGrid.vue + 4 modules
var KvGrid = __webpack_require__(30);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/LendMegaMenu.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ var LendMegaMenuvue_type_script_lang_js_ = ({
  name: 'LendMegaMenu',
  inject: ['apollo', 'cookieStore'],
  components: {
    CountryList: CountryList,
    KvGrid: KvGrid["a" /* default */],
    KvLoadingPlaceholder: KvLoadingPlaceholder["a" /* default */],
    KvMaterialIcon: KvMaterialIcon["a" /* default */],
    SearchList: SearchList
  },
  props: {
    categories: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    favorites: {
      type: Number,
      default: 0
    },
    isRegionsLoading: {
      type: Boolean,
      default: true
    },
    isChannelsLoading: {
      type: Boolean,
      default: true
    },
    userId: {
      type: Number,
      default: null
    },
    regions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    searches: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    showMGUpsellLink: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      categoriesWidth: null,
      openedSection: '',
      savedSearchesTitle: 'Saved searches',
      mdiArrowRight: mdi["c" /* mdiArrowRight */],
      mdiChevronLeft: mdi["p" /* mdiChevronLeft */]
    };
  },
  computed: {
    computedStyle: function computedStyle() {
      var style = 'width: 150%;';

      if (this.sectionOpen) {
        var categoryWidth = this.getRefWidth('categories');
        style += "transform: translateX(".concat(categoryWidth * -1, "px);");
      }

      return style;
    },
    hasSearches: function hasSearches() {
      return this.searches.length > 0;
    },
    sectionOpen: function sectionOpen() {
      return this.openedSection !== '';
    },
    openRegions: function openRegions() {
      var _this = this;

      return this.regions.filter(function (region) {
        return _this.isOpenSection(region.name);
      });
    }
  },
  methods: {
    getRefWidth: function getRefWidth(refPath) {
      var _ref$clientWidth;

      var ref = this.$refs[refPath] || null;
      return (_ref$clientWidth = ref === null || ref === void 0 ? void 0 : ref.clientWidth) !== null && _ref$clientWidth !== void 0 ? _ref$clientWidth : 0;
    },
    onClose: function onClose() {
      this.closeSection();
    },
    isOpenSection: function isOpenSection(section) {
      return this.openedSection === section;
    },
    openSection: function openSection(section) {
      this.openedSection = section;
    },
    closeSection: function closeSection() {
      this.openedSection = '';
    },
    trackMgLinkClick: function trackMgLinkClick() {
      this.$kvTrackEvent('TopNav', 'click-Lend-Menu-Monthly-Good', 'Lend-monthly');
    }
  }
});
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendMegaMenu.vue?vue&type=script&lang=js&
 /* harmony default export */ var LendMenu_LendMegaMenuvue_type_script_lang_js_ = (LendMegaMenuvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/WwwFrame/LendMenu/LendMegaMenu.vue?vue&type=style&index=0&id=4c6ff2a2&lang=postcss&scoped=true&
var LendMegaMenuvue_type_style_index_0_id_4c6ff2a2_lang_postcss_scoped_true_ = __webpack_require__(5563);

// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/LendMegaMenu.vue






/* normalize component */

var LendMegaMenu_component = Object(componentNormalizer["a" /* default */])(
  LendMenu_LendMegaMenuvue_type_script_lang_js_,
  LendMegaMenuvue_type_template_id_4c6ff2a2_scoped_true_render,
  LendMegaMenuvue_type_template_id_4c6ff2a2_scoped_true_staticRenderFns,
  false,
  null,
  "4c6ff2a2",
  null
  
)

const LendMegaMenu_vuedocgen_export_0 = LendMegaMenu_component.exports;
/* harmony default export */ var LendMegaMenu = (LendMegaMenu_vuedocgen_export_0);
LendMegaMenu_vuedocgen_export_0.__docgenInfo = {"displayName":"LendMegaMenu","exportName":"default","description":"","tags":{},"props":[{"name":"categories","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"favorites","type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}},{"name":"isRegionsLoading","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"true"}},{"name":"isChannelsLoading","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"true"}},{"name":"userId","type":{"name":"number"},"defaultValue":{"func":false,"value":"null"}},{"name":"regions","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"searches","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"showMGUpsellLink","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WwwFrame/LendMenu/TheLendMenu.vue?vue&type=script&lang=js&



var _templateObject, _templateObject2;


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










var pageQuery = Object(lib["a" /* gql */])(_templateObject || (_templateObject = taggedTemplateLiteral_default()(["query lendMenu {\n\t\tmy {\n\t\t\tid\n\t\t\tuserAccount {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t}"])));
/* harmony default export */ var TheLendMenuvue_type_script_lang_js_ = ({
  name: 'TheLendMenu',
  components: {
    LendListMenu: LendListMenu,
    LendMegaMenu: LendMegaMenu
  },
  inject: ['apollo', 'cookieStore'],
  data: function data() {
    return {
      userId: null,
      categories: [],
      countryFacets: [],
      favoritesCount: 0,
      savedSearches: [],
      regionDisplayOrder: ['North America', 'Central America', 'South America', 'Africa', 'Eastern Europe', 'Middle East', 'Asia', 'Oceania'],
      loadingSemaphore: 0,
      isRegionsLoading: true,
      isChannelsLoading: true,
      showMGUpsellLink: false
    };
  },
  apollo: {
    query: pageQuery,
    preFetch: true,
    result: function result(_ref) {
      var data = _ref.data;
      this.userId = get_default()(data, 'my.userAccount.id');
    }
  },
  computed: {
    regions: function regions() {
      var facets = map_default()(this.countryFacets, function (facet) {
        return {
          name: facet.country.name,
          region: facet.country.region,
          isoCode: facet.country.isoCode.toLowerCase(),
          count: facet.count || 0
        };
      });

      var groups = groupBy_default()(facets, 'region');

      var regions = map_default()(groups, function (countries, name) {
        return {
          name: name,
          countries: sortBy_default()(countries, 'name')
        };
      });

      return regions.sort(Object(comparators["a" /* indexIn */])(this.regionDisplayOrder, 'name'));
    },
    computedCategories: function computedCategories() {
      var categories = map_default()(this.categories, function (category) {
        var updatedCat = JSON.parse(JSON.stringify(category));
        updatedCat.url = updatedCat.url.replace('lend', 'lend-by-category');
        return updatedCat;
      });

      return sortBy_default()(categories, 'name');
    },
    hasUserId: function hasUserId() {
      return !!this.userId;
    }
  },
  methods: {
    onClose: function onClose() {
      this.$refs.list.onClose();
      this.$refs.mega.onClose();
    },
    onLoad: function onLoad() {
      var _this = this;

      return asyncToGenerator_default()( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
        var _data$lend$loans$tota, _data$lend, _data$lend$loans, _data$my$savedSearche, _data$my, _data$my$savedSearche2, _yield$_this$apollo$q, data;

        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.apollo.watchQuery({
                  query: Object(lib["a" /* gql */])(_templateObject2 || (_templateObject2 = taggedTemplateLiteral_default()(["query countryFacets {\n\t\t\t\t\tlend {\n\t\t\t\t\t\tcountryFacets {\n\t\t\t\t\t\t\tcount\n\t\t\t\t\t\t\tcountry {\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\tregion\n\t\t\t\t\t\t\t\tisoCode\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t}"])))
                }).subscribe({
                  next: function next(_ref2) {
                    var data = _ref2.data;
                    _this.countryFacets = get_default()(data, 'lend.countryFacets');
                    _this.isRegionsLoading = false;
                  }
                });

                _this.apollo.watchQuery({
                  query: lendMenuData_graphql_default.a
                }).subscribe({
                  next: function next(_ref3) {
                    var data = _ref3.data;
                    _this.categories = get_default()(data, 'lend.loanChannels.values');
                    _this.isChannelsLoading = false;
                  }
                });

                if (!_this.hasUserId) {
                  _context.next = 9;
                  break;
                }

                _context.next = 5;
                return _this.apollo.query({
                  query: lendMenuPrivateData_graphql_default.a,
                  variables: {
                    userId: _this.userId
                  },
                  fetchPolicy: 'network-only'
                });

              case 5:
                _yield$_this$apollo$q = _context.sent;
                data = _yield$_this$apollo$q.data;
                _this.favoritesCount = (_data$lend$loans$tota = data === null || data === void 0 ? void 0 : (_data$lend = data.lend) === null || _data$lend === void 0 ? void 0 : (_data$lend$loans = _data$lend.loans) === null || _data$lend$loans === void 0 ? void 0 : _data$lend$loans.totalCount) !== null && _data$lend$loans$tota !== void 0 ? _data$lend$loans$tota : 0;
                _this.savedSearches = (_data$my$savedSearche = data === null || data === void 0 ? void 0 : (_data$my = data.my) === null || _data$my === void 0 ? void 0 : (_data$my$savedSearche2 = _data$my.savedSearches) === null || _data$my$savedSearche2 === void 0 ? void 0 : _data$my$savedSearche2.values) !== null && _data$my$savedSearche !== void 0 ? _data$my$savedSearche : [];

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.showMGUpsellLink = true;
    });
  }
});
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/TheLendMenu.vue?vue&type=script&lang=js&
 /* harmony default export */ var LendMenu_TheLendMenuvue_type_script_lang_js_ = (TheLendMenuvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/WwwFrame/LendMenu/TheLendMenu.vue





/* normalize component */

var TheLendMenu_component = Object(componentNormalizer["a" /* default */])(
  LendMenu_TheLendMenuvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const TheLendMenu_vuedocgen_export_0 = TheLendMenu_component.exports;
/* harmony default export */ var TheLendMenu = __webpack_exports__["default"] = (TheLendMenu_vuedocgen_export_0);
TheLendMenu_vuedocgen_export_0.__docgenInfo = {"displayName":"TheLendMenu","exportName":"default","description":"","tags":{}}

/***/ })

}]);