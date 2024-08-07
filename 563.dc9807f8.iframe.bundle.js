(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[563],{

/***/ 5897:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/CenteredRichText.vue?vue&type=template&id=7564453a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.background,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('kv-grid',{staticClass:"tw-mx-auto tw-text-center tw-justify-items-center",style:(_vm.customGridStyles)},[_c('dynamic-rich-text',{style:(_vm.maxWidthStyles),attrs:{"html":_vm.richContent}})],1)],1)]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/CenteredRichText.vue?vue&type=template&id=7564453a&

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1456);

// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(751);

// EXTERNAL MODULE: ./src/util/contentful/richTextRenderer.js
var richTextRenderer = __webpack_require__(432);

// EXTERNAL MODULE: ./src/components/Contentful/DynamicRichText.vue + 2 modules
var DynamicRichText = __webpack_require__(1460);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvGrid.vue + 4 modules
var KvGrid = __webpack_require__(40);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(36);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/CenteredRichText.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ var CenteredRichTextvue_type_script_lang_js_ = ({
  name: 'CenteredRichText',
  components: {
    DynamicRichText: DynamicRichText["a" /* default */],
    KvGrid: KvGrid["a" /* default */],
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
    background: function background() {
      var _this$content;
      return (_this$content = this.content) === null || _this$content === void 0 || (_this$content = _this$content.contents) === null || _this$content === void 0 ? void 0 : _this$content.find(function (_ref) {
        var contentType = _ref.contentType;
        return contentType ? contentType === 'background' : false;
      });
    },
    richContent: function richContent() {
      var _this$content2, _richContent$richText;
      var richContent = (_this$content2 = this.content) === null || _this$content2 === void 0 || (_this$content2 = _this$content2.contents) === null || _this$content2 === void 0 ? void 0 : _this$content2.find(function (_ref2) {
        var contentType = _ref2.contentType;
        return contentType ? contentType === 'richTextContent' : false;
      });
      var richText = (_richContent$richText = richContent === null || richContent === void 0 ? void 0 : richContent.richText) !== null && _richContent$richText !== void 0 ? _richContent$richText : '';
      return richText ? Object(richTextRenderer["b" /* richTextRenderer */])(richText) : '';
    }
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/CenteredRichText.vue?vue&type=script&lang=js&
 /* harmony default export */ var Contentful_CenteredRichTextvue_type_script_lang_js_ = (CenteredRichTextvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Contentful/CenteredRichText.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Contentful_CenteredRichTextvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var CenteredRichText = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"CenteredRichText","exportName":"default","description":"","tags":{},"props":[{"name":"content","description":"Content group content from Contentful","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);