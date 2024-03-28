(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[30],{

/***/ 5626:
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(2503);
var iterableToArray = __webpack_require__(2502);
var unsupportedIterableToArray = __webpack_require__(1415);
var nonIterableRest = __webpack_require__(2504);
function _toArray(arr) {
  return arrayWithHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableRest();
}
module.exports = _toArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 5750:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/HomePage/NewHomeLoansByCategoryGrid.vue?vue&type=template&id=90d61b3c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.background,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('div',[_c('kiva-multi-category-grid',{attrs:{"contentful-loan-channels":_vm.loanChannels,"loan-display-settings":_vm.loanDisplaySettings,"new-home-exp":true}})],1)])]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/HomePage/NewHomeLoansByCategoryGrid.vue?vue&type=template&id=90d61b3c&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(21);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toArray.js
var toArray = __webpack_require__(5626);
var toArray_default = /*#__PURE__*/__webpack_require__.n(toArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(8);
var taggedTemplateLiteral_default = /*#__PURE__*/__webpack_require__.n(taggedTemplateLiteral);

// EXTERNAL MODULE: ./node_modules/graphql-tag/lib/index.js + 20 modules
var lib = __webpack_require__(4247);

// EXTERNAL MODULE: ./src/util/logReadQueryError.js
var logReadQueryError = __webpack_require__(50);

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1383);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Homepage/HomeExp/KivaMultiCategoryGrid.vue?vue&type=template&id=829bd7dc&
var KivaMultiCategoryGridvue_type_template_id_829bd7dc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('kv-grid',{staticClass:"tw-grid-cols-12"},[_c('div',{staticClass:"tw-col-span-12 md:tw-col-span-3"},[_c('div',{staticClass:"tw-mr-4"},[_c('h4',{staticClass:"tw-mb-4"},[_vm._v("\n\t\t\t\tI want to support\n\t\t\t")]),_vm._v(" "),_c('loan-category-selector-home-exp',{attrs:{"loan-channels":_vm.combinedLoanChannelData,"selected-channel":_vm.selectedChannel.id},on:{"handle-category-click":_vm.handleCategoryClick}})],1)]),_vm._v(" "),_c('div',{staticClass:"tw-col-span-12 md:tw-col-span-9 tw-mt-1.5"},[_c('kiva-loan-card-category',{attrs:{"loan-ids":_vm.selectedChannelLoanIds,"selected-channel":_vm.selectedChannel,"loan-channels":_vm.combinedLoanChannelData,"new-home-exp":_vm.newHomeExp,"show-view-more-card":_vm.showViewMoreCard}})],1)])}
var KivaMultiCategoryGridvue_type_template_id_829bd7dc_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Homepage/HomeExp/KivaMultiCategoryGrid.vue?vue&type=template&id=829bd7dc&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(107);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: ./src/components/LoanCollections/HomeExp/KivaLoanCardCategory.vue + 5 modules
var KivaLoanCardCategory = __webpack_require__(1364);

// EXTERNAL MODULE: ./src/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp.vue + 4 modules
var LoanCategorySelectorHomeExp = __webpack_require__(1365);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvGrid.vue + 4 modules
var KvGrid = __webpack_require__(30);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Homepage/HomeExp/KivaMultiCategoryGrid.vue?vue&type=script&lang=js&





var _templateObject;

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




/* harmony default export */ var KivaMultiCategoryGridvue_type_script_lang_js_ = ({
  name: 'KivaMultiCategoryGrid',
  inject: ['apollo', 'cookieStore'],
  components: {
    LoanCategorySelectorHomeExp: LoanCategorySelectorHomeExp["a" /* default */],
    KivaLoanCardCategory: KivaLoanCardCategory["a" /* default */],
    KvGrid: KvGrid["a" /* default */]
  },
  props: {
    /**
     * Array of loan channel data in an object
     * ex. [{ id: 52, shortName: 'some short name' }]
    * */
    contentfulLoanChannels: {
      type: Array,
      default: function _default() {
        return [];
      }
    },

    /**
     * Additional display settings
     * Possible Options:
     * loanLimit: integer that controls how many loans will be loaded for ALL channels
    * */
    loanDisplaySettings: {
      type: Object,
      default: function _default() {}
    },
    newHomeExp: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      loanChannelData: [],
      selectedChannelId: 0
    };
  },
  computed: {
    combinedLoanChannelData: function combinedLoanChannelData() {
      var _this = this;

      return this.contentfulLoanChannels.map(function (channel) {
        var matchedLoanChannel = _this.loanChannelData.find(function (lc) {
          return lc.id === channel.id;
        });

        return _objectSpread(_objectSpread(_objectSpread({}, matchedLoanChannel), channel), {}, {
          loans: _objectSpread({}, matchedLoanChannel === null || matchedLoanChannel === void 0 ? void 0 : matchedLoanChannel.loans)
        });
      });
    },
    loanChannelIds: function loanChannelIds() {
      return this.contentfulLoanChannels.map(function (channelSetting) {
        return channelSetting.id;
      });
    },
    loanQueryLimit: function loanQueryLimit() {
      var _this$loanDisplaySett, _this$loanDisplaySett2;

      return (_this$loanDisplaySett = (_this$loanDisplaySett2 = this.loanDisplaySettings) === null || _this$loanDisplaySett2 === void 0 ? void 0 : _this$loanDisplaySett2.loanLimit) !== null && _this$loanDisplaySett !== void 0 ? _this$loanDisplaySett : 1;
    },
    selectedChannel: function selectedChannel() {
      var _this2 = this;

      return this.combinedLoanChannelData.find(function (loanChannel) {
        return loanChannel.id === _this2.selectedChannelId;
      });
    },
    selectedChannelLoanIds: function selectedChannelLoanIds() {
      var _this3 = this,
          _selectedChannel$loan,
          _selectedChannel$loan2,
          _selectedChannel$loan3;

      var selectedChannel = this.combinedLoanChannelData.find(function (channel) {
        var _this3$selectedChanne;

        return ((_this3$selectedChanne = _this3.selectedChannel) === null || _this3$selectedChanne === void 0 ? void 0 : _this3$selectedChanne.id) === channel.id;
      });
      return (_selectedChannel$loan = selectedChannel === null || selectedChannel === void 0 ? void 0 : (_selectedChannel$loan2 = selectedChannel.loans) === null || _selectedChannel$loan2 === void 0 ? void 0 : (_selectedChannel$loan3 = _selectedChannel$loan2.values) === null || _selectedChannel$loan3 === void 0 ? void 0 : _selectedChannel$loan3.map(function (loan) {
        return loan.id;
      })) !== null && _selectedChannel$loan !== void 0 ? _selectedChannel$loan : Array(this.loanQueryLimit).fill(0);
    },
    showViewMoreCard: function showViewMoreCard() {
      var _this$loanDisplaySett3, _this$loanDisplaySett4;

      return (_this$loanDisplaySett3 = (_this$loanDisplaySett4 = this.loanDisplaySettings) === null || _this$loanDisplaySett4 === void 0 ? void 0 : _this$loanDisplaySett4.showViewMoreCard) !== null && _this$loanDisplaySett3 !== void 0 ? _this$loanDisplaySett3 : false;
    }
  },
  created: function created() {
    // Copy initial loan channel data from contentful and select first channel
    this.loanChannelData = this.contentfulLoanChannels;

    var _this$loanChannelIds = slicedToArray_default()(this.loanChannelIds, 1);

    this.selectedChannelId = _this$loanChannelIds[0];
  },
  mounted: function mounted() {
    // Load data for first channel
    this.fetchLoanChannel(this.selectedChannelId);
  },
  methods: {
    handleCategoryClick: function handleCategoryClick(payload) {
      this.selectedChannelId = payload.categoryId;
      this.fetchLoanChannel(this.selectedChannelId);
    },
    fetchLoanChannel: function fetchLoanChannel(id) {
      var _this4 = this;

      this.apollo.query({
        query: Object(lib["a" /* gql */])(_templateObject || (_templateObject = taggedTemplateLiteral_default()(["query selectedLoanCategory($loanChannelIds: [Int]!, $loanLimit: Int) {\n\t\t\t\t\tlend {\n\t\t\t\t\t\tloanChannelsById(ids: $loanChannelIds){\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\turl\n\t\t\t\t\t\t\tloans(limit: $loanLimit) {\n\t\t\t\t\t\t\t\tvalues {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}"]))),
        variables: {
          loanChannelIds: [id],
          loanLimit: this.loanQueryLimit
        }
      }).then(function (result) {
        var _result$data$lend$loa, _result$data, _result$data$lend;

        // Get clone of loanChannelData for modification
        var loanChannelData = toConsumableArray_default()(_this4.loanChannelData); // Get array index of the fetched loan channel for updating the data


        var channelIndex = _this4.loanChannelIds.indexOf(id); // Set new channel data if available, otherwise use existing data


        var loanChannel = (_result$data$lend$loa = result === null || result === void 0 ? void 0 : (_result$data = result.data) === null || _result$data === void 0 ? void 0 : (_result$data$lend = _result$data.lend) === null || _result$data$lend === void 0 ? void 0 : _result$data$lend.loanChannelsById[0]) !== null && _result$data$lend$loa !== void 0 ? _result$data$lend$loa : loanChannelData[channelIndex];
        loanChannelData[channelIndex] = loanChannel;
        _this4.loanChannelData = loanChannelData;
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/Homepage/HomeExp/KivaMultiCategoryGrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var HomeExp_KivaMultiCategoryGridvue_type_script_lang_js_ = (KivaMultiCategoryGridvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Homepage/HomeExp/KivaMultiCategoryGrid.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  HomeExp_KivaMultiCategoryGridvue_type_script_lang_js_,
  KivaMultiCategoryGridvue_type_template_id_829bd7dc_render,
  KivaMultiCategoryGridvue_type_template_id_829bd7dc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var KivaMultiCategoryGrid = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"KivaMultiCategoryGrid","exportName":"default","description":"","tags":{},"props":[{"name":"contentfulLoanChannels","description":"Array of loan channel data in an object\nex. [{ id: 52, shortName: 'some short name' }]","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"loanDisplaySettings","description":"Additional display settings\nPossible Options:\nloanLimit: integer that controls how many loans will be loaded for ALL channels","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}},{"name":"newHomeExp","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}]}
// EXTERNAL MODULE: ./src/components/LoanCards/NewHomePageLoanCard.vue + 4 modules
var NewHomePageLoanCard = __webpack_require__(529);

// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(696);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(29);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/HomePage/NewHomeLoansByCategoryGrid.vue?vue&type=script&lang=js&





var NewHomeLoansByCategoryGridvue_type_script_lang_js_templateObject;

function NewHomeLoansByCategoryGridvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function NewHomeLoansByCategoryGridvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { NewHomeLoansByCategoryGridvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { defineProperty_default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { NewHomeLoansByCategoryGridvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/**
 * Extract Loan Channel settings from Contentful Ui Setting dataObject
* */

var getContentfulLoanChannels = function getContentfulLoanChannels(content) {
  var _content$contents, _uiSetting$dataObject, _uiSetting$dataObject2;

  var uiSetting = content === null || content === void 0 ? void 0 : (_content$contents = content.contents) === null || _content$contents === void 0 ? void 0 : _content$contents.find(function (_ref) {
    var contentType = _ref.contentType;
    return contentType ? contentType === 'uiSetting' : false;
  });
  return (_uiSetting$dataObject = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject2 = uiSetting.dataObject) === null || _uiSetting$dataObject2 === void 0 ? void 0 : _uiSetting$dataObject2.loanChannels) !== null && _uiSetting$dataObject !== void 0 ? _uiSetting$dataObject : [];
};

var loanCategoryPrefetchQuery = Object(lib["a" /* gql */])(NewHomeLoansByCategoryGridvue_type_script_lang_js_templateObject || (NewHomeLoansByCategoryGridvue_type_script_lang_js_templateObject = taggedTemplateLiteral_default()(["\n\t", "\n\tquery loanCategoryPrefetch($loanChannelIds: [Int]!, $limit: Int) {\n\t\tlend {\n\t\t\tloanChannelsById(ids: $loanChannelIds) {\n\t\t\t\tid\n\t\t\t\tloans(limit: $limit) {\n\t\t\t\t\tvalues {\n\t\t\t\t\t\tid\n\t\t\t\t\t\t...loanFields\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"])), NewHomePageLoanCard["b" /* loanFieldsFragment */]);
/* harmony default export */ var NewHomeLoansByCategoryGridvue_type_script_lang_js_ = ({
  name: 'NewHomeLoansByCategoryGrid',
  inject: ['apollo', 'cookieStore', 'device'],
  components: {
    KivaMultiCategoryGrid: KivaMultiCategoryGrid,
    KvPageContainer: KvPageContainer["a" /* default */],
    SectionWithBackgroundClassic: SectionWithBackgroundClassic["a" /* default */]
  },
  mixins: [contentful_ui_setting_styles_mixin["a" /* default */]],
  props: {
    /**
     * Content group content from Contentful
    * */
    content: {
      type: Object,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      loanChannels: []
    };
  },
  computed: {
    /**
     * Extract Background content from Contentful
    * */
    background: function background() {
      var _this$content, _this$content$content;

      return (_this$content = this.content) === null || _this$content === void 0 ? void 0 : (_this$content$content = _this$content.contents) === null || _this$content$content === void 0 ? void 0 : _this$content$content.find(function (_ref2) {
        var contentType = _ref2.contentType;
        return contentType ? contentType === 'background' : false;
      });
    },
    contentfulLoanChannels: function contentfulLoanChannels() {
      return getContentfulLoanChannels(this.content);
    },

    /**
     * Extract Loan Display settings from Contentful Ui Setting dataObject
    * */
    loanDisplaySettings: function loanDisplaySettings() {
      var _this$content2, _this$content2$conten, _uiSetting$dataObject3, _uiSetting$dataObject4, _uiSetting$dataObject5, _uiSetting$dataObject6;

      var uiSetting = (_this$content2 = this.content) === null || _this$content2 === void 0 ? void 0 : (_this$content2$conten = _this$content2.contents) === null || _this$content2$conten === void 0 ? void 0 : _this$content2$conten.find(function (_ref3) {
        var contentType = _ref3.contentType;
        return contentType ? contentType === 'uiSetting' : false;
      });
      return {
        loanLimit: (_uiSetting$dataObject3 = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject4 = uiSetting.dataObject) === null || _uiSetting$dataObject4 === void 0 ? void 0 : _uiSetting$dataObject4.loanLimit) !== null && _uiSetting$dataObject3 !== void 0 ? _uiSetting$dataObject3 : 1,
        showViewMoreCard: (_uiSetting$dataObject5 = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject6 = uiSetting.dataObject) === null || _uiSetting$dataObject6 === void 0 ? void 0 : _uiSetting$dataObject6.showViewMoreCard) !== null && _uiSetting$dataObject5 !== void 0 ? _uiSetting$dataObject5 : false
      };
    }
  },
  apollo: {
    preFetch: function preFetch(config, client, _ref4) {
      var _contentfulLoanChanne, _device$platform;

      var content = _ref4.content,
          device = _ref4.device;
      var contentfulLoanChannels = getContentfulLoanChannels(content);
      var id = (_contentfulLoanChanne = contentfulLoanChannels[0]) === null || _contentfulLoanChanne === void 0 ? void 0 : _contentfulLoanChanne.id;
      return client.query({
        query: loanCategoryPrefetchQuery,
        variables: {
          loanChannelIds: id ? [id] : [],
          limit: (device === null || device === void 0 ? void 0 : (_device$platform = device.platform) === null || _device$platform === void 0 ? void 0 : _device$platform.type) === 'desktop' ? 6 : 1
        }
      });
    }
  },
  created: function created() {
    var _this$device, _this$device$platform, _data$lend$loanChanne, _data, _data$lend;

    // Fetch loan channel data from the cache
    var data = {};
    var isDesktop = ((_this$device = this.device) === null || _this$device === void 0 ? void 0 : (_this$device$platform = _this$device.platform) === null || _this$device$platform === void 0 ? void 0 : _this$device$platform.type) === 'desktop';

    try {
      var _this$contentfulLoanC;

      var id = (_this$contentfulLoanC = this.contentfulLoanChannels[0]) === null || _this$contentfulLoanC === void 0 ? void 0 : _this$contentfulLoanC.id;
      data = this.apollo.readQuery({
        query: loanCategoryPrefetchQuery,
        variables: {
          loanChannelIds: id ? [id] : [],
          limit: isDesktop ? 6 : 1
        }
      });
    } catch (e) {
      Object(logReadQueryError["a" /* default */])(e, 'NewHomeLoansByCategoryGrid loanCategoryPrefetch');
    } // Create an array with placeholder loans for loading


    var _this$loanDisplaySett = this.loanDisplaySettings.loanLimit,
        loanLimit = _this$loanDisplaySett === void 0 ? 0 : _this$loanDisplaySett; // Get the fetched loan and merge it into the placeholder loan array

    var loanChannel = (_data$lend$loanChanne = (_data = data) === null || _data === void 0 ? void 0 : (_data$lend = _data.lend) === null || _data$lend === void 0 ? void 0 : _data$lend.loanChannelsById[0]) !== null && _data$lend$loanChanne !== void 0 ? _data$lend$loanChanne : {
      loans: {
        values: []
      }
    };
    var loanValues;

    if (isDesktop) {
      var _loanChannel$loans;

      loanValues = loanChannel === null || loanChannel === void 0 ? void 0 : (_loanChannel$loans = loanChannel.loans) === null || _loanChannel$loans === void 0 ? void 0 : _loanChannel$loans.values;
    } else {
      var _loanChannel$loans2;

      loanValues = Array(loanLimit).fill({
        id: 0
      });
      loanValues[0] = loanChannel === null || loanChannel === void 0 ? void 0 : (_loanChannel$loans2 = loanChannel.loans) === null || _loanChannel$loans2 === void 0 ? void 0 : _loanChannel$loans2.values[0];
    }

    var loanChannelCopy = NewHomeLoansByCategoryGridvue_type_script_lang_js_objectSpread(NewHomeLoansByCategoryGridvue_type_script_lang_js_objectSpread({}, loanChannel), {}, {
      loans: {
        values: loanValues
      }
    }); // Set the channel with the prefetched loan


    var _this$contentfulLoanC2 = toArray_default()(this.contentfulLoanChannels),
        firstChannel = _this$contentfulLoanC2[0],
        otherChannels = _this$contentfulLoanC2.slice(1);

    this.loanChannels = [NewHomeLoansByCategoryGridvue_type_script_lang_js_objectSpread(NewHomeLoansByCategoryGridvue_type_script_lang_js_objectSpread({}, firstChannel), loanChannelCopy)].concat(toConsumableArray_default()(otherChannels));
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/HomePage/NewHomeLoansByCategoryGrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var HomePage_NewHomeLoansByCategoryGridvue_type_script_lang_js_ = (NewHomeLoansByCategoryGridvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Contentful/HomePage/NewHomeLoansByCategoryGrid.vue





/* normalize component */

var NewHomeLoansByCategoryGrid_component = Object(componentNormalizer["a" /* default */])(
  HomePage_NewHomeLoansByCategoryGridvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const NewHomeLoansByCategoryGrid_vuedocgen_export_0 = NewHomeLoansByCategoryGrid_component.exports;
/* harmony default export */ var NewHomeLoansByCategoryGrid = __webpack_exports__["default"] = (NewHomeLoansByCategoryGrid_vuedocgen_export_0);
NewHomeLoansByCategoryGrid_vuedocgen_export_0.__docgenInfo = {"displayName":"NewHomeLoansByCategoryGrid","exportName":"default","description":"","tags":{},"props":[{"name":"content","description":"Content group content from Contentful","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);