(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[567],{

/***/ 5791:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/RichTextItemsCentered.vue?vue&type=template&id=8c1e46b6&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.sectionBackground,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('kv-grid',{staticClass:"tw-grid-cols-12 tw-justify-items-center tw-text-center",style:(_vm.customGridStyles)},_vm._l((_vm.richContentfulContent),function(item,index){return _c('div',{key:index,class:{
						'tw-col-span-12': true,
						'md:tw-col-span-6': _vm.richContentfulContent.length >= 2,
						'lg:tw-col-span-6': _vm.richContentfulContent.length === 2,
						'lg:tw-col-span-4': _vm.richContentfulContent.length === 3,
						'lg:tw-col-span-3': _vm.richContentfulContent.length === 4,
					},style:(_vm.maxWidthStyles)},[_c('div',{staticClass:"tw-pt-2"},[_c('dynamic-rich-text',{attrs:{"html":_vm.parsedRichContent(item)}})],1)])}),0)],1)]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/RichTextItemsCentered.vue?vue&type=template&id=8c1e46b6&

// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(704);

// EXTERNAL MODULE: ./src/util/contentful/richTextRenderer.js
var richTextRenderer = __webpack_require__(393);

// EXTERNAL MODULE: ./src/components/Contentful/DynamicRichText.vue + 2 modules
var DynamicRichText = __webpack_require__(1391);

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1387);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(28);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvGrid.vue + 4 modules
var KvGrid = __webpack_require__(31);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/RichTextItemsCentered.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ var RichTextItemsCenteredvue_type_script_lang_js_ = ({
  name: 'RichTextItemsCentered',
  components: {
    KvGrid: KvGrid["a" /* default */],
    KvPageContainer: KvPageContainer["a" /* default */],
    SectionWithBackgroundClassic: SectionWithBackgroundClassic["a" /* default */],
    DynamicRichText: DynamicRichText["a" /* default */]
  },
  mixins: [contentful_ui_setting_styles_mixin["a" /* default */]],
  props: {
    content: {
      type: Object,
      default: function _default() {}
    }
  },
  methods: {
    parsedRichContent: function parsedRichContent(item) {
      var _item$richText;
      var richText = (_item$richText = item === null || item === void 0 ? void 0 : item.richText) !== null && _item$richText !== void 0 ? _item$richText : '';
      return richText ? Object(richTextRenderer["b" /* richTextRenderer */])(richText) : '';
    }
  },
  computed: {
    sectionBackground: function sectionBackground() {
      var _this$content;
      return (_this$content = this.content) === null || _this$content === void 0 || (_this$content = _this$content.contents) === null || _this$content === void 0 ? void 0 : _this$content.find(function (_ref) {
        var contentType = _ref.contentType;
        return contentType ? contentType === 'background' : false;
      });
    },
    richContentfulContent: function richContentfulContent() {
      var _this$content2;
      var richContentfulData = (_this$content2 = this.content) === null || _this$content2 === void 0 || (_this$content2 = _this$content2.contents) === null || _this$content2 === void 0 ? void 0 : _this$content2.filter(function (_ref2) {
        var contentType = _ref2.contentType;
        return contentType === 'richTextContent';
      });
      return richContentfulData;
    }
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/RichTextItemsCentered.vue?vue&type=script&lang=js&
 /* harmony default export */ var Contentful_RichTextItemsCenteredvue_type_script_lang_js_ = (RichTextItemsCenteredvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Contentful/RichTextItemsCentered.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Contentful_RichTextItemsCenteredvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var RichTextItemsCentered = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"RichTextItemsCentered","exportName":"default","description":"","tags":{},"props":[{"name":"content","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);