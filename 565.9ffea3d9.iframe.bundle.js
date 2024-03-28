(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[565],{

/***/ 5748:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/LoansByCategoryCarousel.vue?vue&type=template&id=28918f6b&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.background,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('div',[_c('kiva-classic-multi-category-carousel',{attrs:{"contentful-loan-channels":_vm.contentfulLoanChannels,"loan-display-settings":_vm.loanDisplaySettings}})],1)])]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/LoansByCategoryCarousel.vue?vue&type=template&id=28918f6b&

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1383);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCollections/KivaClassicMultiCategoryCarousel.vue?vue&type=template&id=25a67d47&
var KivaClassicMultiCategoryCarouselvue_type_template_id_25a67d47_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.combinedLoanChannelData.length > 1)?_c('kiva-classic-loan-category-selector',{attrs:{"loan-channels":_vm.combinedLoanChannelData,"selected-channel":_vm.selectedChannel.id},on:{"handle-category-click":_vm.handleCategoryClick}}):_vm._e(),_vm._v(" "),_c('kiva-classic-loan-carousel',{attrs:{"is-visible":_vm.showCarousel,"loan-ids":_vm.selectedChannelLoanIds,"selected-channel":_vm.selectedChannel,"show-view-more-card":_vm.showViewMoreCard}})],1)}
var KivaClassicMultiCategoryCarouselvue_type_template_id_25a67d47_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicMultiCategoryCarousel.vue?vue&type=template&id=25a67d47&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(8);
var taggedTemplateLiteral_default = /*#__PURE__*/__webpack_require__.n(taggedTemplateLiteral);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/graphql-tag/lib/index.js + 20 modules
var lib = __webpack_require__(4247);

// EXTERNAL MODULE: ./src/components/LoanCollections/KivaClassicLoanCarousel.vue + 4 modules
var KivaClassicLoanCarousel = __webpack_require__(932);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCollections/KivaClassicLoanCategorySelector.vue?vue&type=template&id=000744de&
var KivaClassicLoanCategorySelectorvue_type_template_id_000744de_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tw-flex tw-justify-start md:tw-justify-center\n\t\tmd:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"},_vm._l((_vm.loanChannels),function(category){return _c('kv-button',{key:category.id,staticClass:"tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap",attrs:{"variant":_vm.selectedChannel === category.id ? 'link' : 'ghost'},on:{"click":function($event){return _vm.handleCategoryClick(category)}}},[_vm._v("\n\t\t"+_vm._s(category.shortName)+"\n\t")])}),1)}
var KivaClassicLoanCategorySelectorvue_type_template_id_000744de_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicLoanCategorySelector.vue?vue&type=template&id=000744de&

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvButton.vue + 4 modules
var KvButton = __webpack_require__(17);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCollections/KivaClassicLoanCategorySelector.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var KivaClassicLoanCategorySelectorvue_type_script_lang_js_ = ({
  name: 'KivaClassicLoanCategorySelector',
  components: {
    KvButton: KvButton["a" /* default */]
  },
  props: {
    /**
     * Array of loan channel data in an object
    * */
    loanChannels: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    selectedChannel: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleCategoryClick: function handleCategoryClick(category) {
      var _category$id, _category$shortName;

      var categoryId = (_category$id = category === null || category === void 0 ? void 0 : category.id) !== null && _category$id !== void 0 ? _category$id : null;
      var categoryShortName = (_category$shortName = category === null || category === void 0 ? void 0 : category.shortName) !== null && _category$shortName !== void 0 ? _category$shortName : ''; // build event category from url, special case for homepage, clean page path otherwise

      var eventContext = this.$route.path === '/' ? 'homepage' : this.$route.path.replace(/\//g, '-').replace('-', '');
      this.$kvTrackEvent(eventContext, 'click-contentful-loan-carousel-category', categoryShortName, categoryId, categoryId);
      this.$emit('handle-category-click', {
        categoryId: categoryId
      });
      return false;
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicLoanCategorySelector.vue?vue&type=script&lang=js&
 /* harmony default export */ var LoanCollections_KivaClassicLoanCategorySelectorvue_type_script_lang_js_ = (KivaClassicLoanCategorySelectorvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicLoanCategorySelector.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  LoanCollections_KivaClassicLoanCategorySelectorvue_type_script_lang_js_,
  KivaClassicLoanCategorySelectorvue_type_template_id_000744de_render,
  KivaClassicLoanCategorySelectorvue_type_template_id_000744de_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var KivaClassicLoanCategorySelector = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"KivaClassicLoanCategorySelector","exportName":"default","description":"","tags":{},"props":[{"name":"loanChannels","description":"Array of loan channel data in an object","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"selectedChannel","type":{"name":"number"},"defaultValue":{"func":false,"value":"0"}}],"events":[{"name":"handle-category-click","type":{"names":["undefined"]}}]}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoanCollections/KivaClassicMultiCategoryCarousel.vue?vue&type=script&lang=js&



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



/* harmony default export */ var KivaClassicMultiCategoryCarouselvue_type_script_lang_js_ = ({
  name: 'KivaClassicMultiCategoryCarousel',
  inject: ['apollo', 'cookieStore'],
  components: {
    KivaClassicLoanCarousel: KivaClassicLoanCarousel["a" /* default */],
    KivaClassicLoanCategorySelector: KivaClassicLoanCategorySelector
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
    }
  },
  data: function data() {
    return {
      loanChannelData: [],
      selectedChannel: {},
      showCarousel: false
    };
  },
  computed: {
    combinedLoanChannelData: function combinedLoanChannelData() {
      var _this = this;

      return this.contentfulLoanChannels.map(function (channel) {
        var matchedLoanChannel = _this.loanChannelData.find(function (lc) {
          return lc.id === channel.id;
        });

        return _objectSpread(_objectSpread({}, matchedLoanChannel), channel);
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
    selectedChannelLoanIds: function selectedChannelLoanIds() {
      var _this2 = this,
          _selectedChannel$loan,
          _selectedChannel$loan2,
          _selectedChannel$loan3;

      var selectedChannel = this.combinedLoanChannelData.find(function (channel) {
        var _this2$selectedChanne;

        return ((_this2$selectedChanne = _this2.selectedChannel) === null || _this2$selectedChanne === void 0 ? void 0 : _this2$selectedChanne.id) === channel.id;
      });
      return (_selectedChannel$loan = selectedChannel === null || selectedChannel === void 0 ? void 0 : (_selectedChannel$loan2 = selectedChannel.loans) === null || _selectedChannel$loan2 === void 0 ? void 0 : (_selectedChannel$loan3 = _selectedChannel$loan2.values) === null || _selectedChannel$loan3 === void 0 ? void 0 : _selectedChannel$loan3.map(function (loan) {
        return loan.id;
      })) !== null && _selectedChannel$loan !== void 0 ? _selectedChannel$loan : [];
    },
    showViewMoreCard: function showViewMoreCard() {
      var _this$loanDisplaySett3, _this$loanDisplaySett4;

      return (_this$loanDisplaySett3 = (_this$loanDisplaySett4 = this.loanDisplaySettings) === null || _this$loanDisplaySett4 === void 0 ? void 0 : _this$loanDisplaySett4.showViewMoreCard) !== null && _this$loanDisplaySett3 !== void 0 ? _this$loanDisplaySett3 : false;
    }
  },
  mounted: function mounted() {
    this.fetchLoanChannel();
  },
  methods: {
    handleCategoryClick: function handleCategoryClick(payload) {
      this.selectedChannel = this.combinedLoanChannelData.find(function (loanChannel) {
        return loanChannel.id === payload.categoryId;
      });
    },
    fetchLoanChannel: function fetchLoanChannel() {
      var _this3 = this;

      this.apollo.query({
        query: Object(lib["a" /* gql */])(_templateObject || (_templateObject = taggedTemplateLiteral_default()(["query selectedLoanCategory($loanChannelIds: [Int]!, $loanLimit: Int) {\n\t\t\t\t\tlend {\n\t\t\t\t\t\tloanChannelsById(ids: $loanChannelIds){\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\turl\n\t\t\t\t\t\t\t# description\n\t\t\t\t\t\t\tloans(limit: $loanLimit) {\n\t\t\t\t\t\t\t\tvalues {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}"]))),
        variables: {
          loanChannelIds: this.loanChannelIds,
          loanLimit: this.loanQueryLimit
        }
      }).then(function (result) {
        var _result$data$lend$loa, _result$data, _result$data$lend;

        // Set All Active Loan Channels Data
        var loanChannels = (_result$data$lend$loa = result === null || result === void 0 ? void 0 : (_result$data = result.data) === null || _result$data === void 0 ? void 0 : (_result$data$lend = _result$data.lend) === null || _result$data$lend === void 0 ? void 0 : _result$data$lend.loanChannelsById) !== null && _result$data$lend$loa !== void 0 ? _result$data$lend$loa : [];
        _this3.loanChannelData = loanChannels; // Activate the first channel available

        var initialChannel = _this3.combinedLoanChannelData[0];
        _this3.selectedChannel = initialChannel; // Make the carousel visible

        _this3.showCarousel = true;
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicMultiCategoryCarousel.vue?vue&type=script&lang=js&
 /* harmony default export */ var LoanCollections_KivaClassicMultiCategoryCarouselvue_type_script_lang_js_ = (KivaClassicMultiCategoryCarouselvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/LoanCollections/KivaClassicMultiCategoryCarousel.vue





/* normalize component */

var KivaClassicMultiCategoryCarousel_component = Object(componentNormalizer["a" /* default */])(
  LoanCollections_KivaClassicMultiCategoryCarouselvue_type_script_lang_js_,
  KivaClassicMultiCategoryCarouselvue_type_template_id_25a67d47_render,
  KivaClassicMultiCategoryCarouselvue_type_template_id_25a67d47_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const KivaClassicMultiCategoryCarousel_vuedocgen_export_0 = KivaClassicMultiCategoryCarousel_component.exports;
/* harmony default export */ var KivaClassicMultiCategoryCarousel = (KivaClassicMultiCategoryCarousel_vuedocgen_export_0);
KivaClassicMultiCategoryCarousel_vuedocgen_export_0.__docgenInfo = {"displayName":"KivaClassicMultiCategoryCarousel","exportName":"default","description":"","tags":{},"props":[{"name":"contentfulLoanChannels","description":"Array of loan channel data in an object\nex. [{ id: 52, shortName: 'some short name' }]","type":{"name":"array"},"defaultValue":{"func":false,"value":"[]"}},{"name":"loanDisplaySettings","description":"Additional display settings\nPossible Options:\nloanLimit: integer that controls how many loans will be loaded for ALL channels","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}
// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(696);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(29);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/LoansByCategoryCarousel.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var LoansByCategoryCarouselvue_type_script_lang_js_ = ({
  name: 'LoansByCategoryCarousel',
  components: {
    KivaClassicMultiCategoryCarousel: KivaClassicMultiCategoryCarousel,
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
    return {};
  },
  computed: {
    /**
     * Extract Background content from Contentful
    * */
    background: function background() {
      var _this$content, _this$content$content;

      return (_this$content = this.content) === null || _this$content === void 0 ? void 0 : (_this$content$content = _this$content.contents) === null || _this$content$content === void 0 ? void 0 : _this$content$content.find(function (_ref) {
        var contentType = _ref.contentType;
        return contentType ? contentType === 'background' : false;
      });
    },

    /**
     * Extract Loan Channel settings from Contentful Ui Setting dataObject
    * */
    contentfulLoanChannels: function contentfulLoanChannels() {
      var _this$content2, _this$content2$conten, _uiSetting$dataObject, _uiSetting$dataObject2;

      var uiSetting = (_this$content2 = this.content) === null || _this$content2 === void 0 ? void 0 : (_this$content2$conten = _this$content2.contents) === null || _this$content2$conten === void 0 ? void 0 : _this$content2$conten.find(function (_ref2) {
        var contentType = _ref2.contentType;
        return contentType ? contentType === 'uiSetting' : false;
      });
      return (_uiSetting$dataObject = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject2 = uiSetting.dataObject) === null || _uiSetting$dataObject2 === void 0 ? void 0 : _uiSetting$dataObject2.loanChannels) !== null && _uiSetting$dataObject !== void 0 ? _uiSetting$dataObject : [];
    },

    /**
     * Extract Loan Display settings from Contentful Ui Setting dataObject
    * */
    loanDisplaySettings: function loanDisplaySettings() {
      var _this$content3, _this$content3$conten, _uiSetting$dataObject3, _uiSetting$dataObject4, _uiSetting$dataObject5, _uiSetting$dataObject6;

      var uiSetting = (_this$content3 = this.content) === null || _this$content3 === void 0 ? void 0 : (_this$content3$conten = _this$content3.contents) === null || _this$content3$conten === void 0 ? void 0 : _this$content3$conten.find(function (_ref3) {
        var contentType = _ref3.contentType;
        return contentType ? contentType === 'uiSetting' : false;
      });
      return {
        loanLimit: (_uiSetting$dataObject3 = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject4 = uiSetting.dataObject) === null || _uiSetting$dataObject4 === void 0 ? void 0 : _uiSetting$dataObject4.loanLimit) !== null && _uiSetting$dataObject3 !== void 0 ? _uiSetting$dataObject3 : 1,
        showViewMoreCard: (_uiSetting$dataObject5 = uiSetting === null || uiSetting === void 0 ? void 0 : (_uiSetting$dataObject6 = uiSetting.dataObject) === null || _uiSetting$dataObject6 === void 0 ? void 0 : _uiSetting$dataObject6.showViewMoreCard) !== null && _uiSetting$dataObject5 !== void 0 ? _uiSetting$dataObject5 : false
      };
    }
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/LoansByCategoryCarousel.vue?vue&type=script&lang=js&
 /* harmony default export */ var Contentful_LoansByCategoryCarouselvue_type_script_lang_js_ = (LoansByCategoryCarouselvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Contentful/LoansByCategoryCarousel.vue





/* normalize component */

var LoansByCategoryCarousel_component = Object(componentNormalizer["a" /* default */])(
  Contentful_LoansByCategoryCarouselvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const LoansByCategoryCarousel_vuedocgen_export_0 = LoansByCategoryCarousel_component.exports;
/* harmony default export */ var LoansByCategoryCarousel = __webpack_exports__["default"] = (LoansByCategoryCarousel_vuedocgen_export_0);
LoansByCategoryCarousel_vuedocgen_export_0.__docgenInfo = {"displayName":"LoansByCategoryCarousel","exportName":"default","description":"","tags":{},"props":[{"name":"content","description":"Content group content from Contentful","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);