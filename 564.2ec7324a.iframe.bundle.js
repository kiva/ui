(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[564],{

/***/ 5790:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/FrequentlyAskedQuestions.vue?vue&type=template&id=e55e5aa6&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.background,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('kv-frequently-asked-questions',{attrs:{"headline":_vm.frequentlyAskedQuestionsHeadline,"questions":_vm.frequentlyAskedQuestions}})],1)]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/FrequentlyAskedQuestions.vue?vue&type=template&id=e55e5aa6&

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1387);

// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(704);

// EXTERNAL MODULE: ./src/components/Kv/KvFrequentlyAskedQuestions.vue + 4 modules
var KvFrequentlyAskedQuestions = __webpack_require__(1371);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(28);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/FrequentlyAskedQuestions.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var FrequentlyAskedQuestionsvue_type_script_lang_js_ = ({
  name: 'FrequentlyAskedQuestions',
  components: {
    KvFrequentlyAskedQuestions: KvFrequentlyAskedQuestions["default"],
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
  computed: {
    frequentlyAskedQuestionsHeadline: function frequentlyAskedQuestionsHeadline() {
      var _this$content$title, _this$content;
      return (_this$content$title = (_this$content = this.content) === null || _this$content === void 0 ? void 0 : _this$content.title) !== null && _this$content$title !== void 0 ? _this$content$title : null;
    },
    frequentlyAskedQuestions: function frequentlyAskedQuestions() {
      var _this$content2;
      return (_this$content2 = this.content) === null || _this$content2 === void 0 || (_this$content2 = _this$content2.contents) === null || _this$content2 === void 0 ? void 0 : _this$content2.filter(function (_ref) {
        var contentType = _ref.contentType;
        return contentType ? contentType === 'richTextContent' : false;
      });
    },
    background: function background() {
      var _this$content3;
      return (_this$content3 = this.content) === null || _this$content3 === void 0 || (_this$content3 = _this$content3.contents) === null || _this$content3 === void 0 ? void 0 : _this$content3.find(function (_ref2) {
        var contentType = _ref2.contentType;
        return contentType ? contentType === 'background' : false;
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/FrequentlyAskedQuestions.vue?vue&type=script&lang=js&
 /* harmony default export */ var Contentful_FrequentlyAskedQuestionsvue_type_script_lang_js_ = (FrequentlyAskedQuestionsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Contentful/FrequentlyAskedQuestions.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Contentful_FrequentlyAskedQuestionsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var FrequentlyAskedQuestions = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"FrequentlyAskedQuestions","exportName":"default","description":"","tags":{},"props":[{"name":"content","description":"Content group content from Contentful","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);