(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[566],{

/***/ 5759:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/MediaItemsCentered.vue?vue&type=template&id=e8d0d9bc&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section-with-background-classic',{attrs:{"background-content":_vm.sectionBackground,"theme-name":_vm.themeName,"vertical-padding":_vm.verticalPadding},scopedSlots:_vm._u([{key:"content",fn:function(){return [_c('kv-page-container',[_c('kv-grid',{staticClass:"tw-grid-cols-12 lg:tw-grid-cols-10 lg:tw-gap-y-4\n\t\t\t\t\ttw-justify-items-center tw-text-center tw-rounded tw-bg-white\n\t\t\t\t\ttw-py-5 lg:tw-px-[177px]",style:(_vm.customGridStyles)},_vm._l((_vm.contentfulMediaItems),function(item,index){return _c('span',{key:index,staticClass:"tw-flex tw-justify-items-center tw-items-center tw-mb-2",class:[_vm.itemClasses, {
						'md:tw-col-span-12': index === 9
					}]},[_c('kv-contentful-img',{style:(_vm.maxWidthStyles),attrs:{"contentful-src":item.file.url,"alt":item.file.description,"width":item.file.details.image.width,"height":item.file.details.image.height}})],1)}),0)],1)]},proxy:true}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Contentful/MediaItemsCentered.vue?vue&type=template&id=e8d0d9bc&

// EXTERNAL MODULE: ./src/components/Contentful/SectionWithBackgroundClassic.vue + 4 modules
var SectionWithBackgroundClassic = __webpack_require__(696);

// EXTERNAL MODULE: ./src/plugins/contentful-ui-setting-styles-mixin.js
var contentful_ui_setting_styles_mixin = __webpack_require__(1383);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvPageContainer.vue + 4 modules
var KvPageContainer = __webpack_require__(29);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvGrid.vue + 4 modules
var KvGrid = __webpack_require__(30);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvContentfulImg.vue + 4 modules
var KvContentfulImg = __webpack_require__(291);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Contentful/MediaItemsCentered.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var MediaItemsCenteredvue_type_script_lang_js_ = ({
  name: 'MediaItemsCentered',
  components: {
    KvGrid: KvGrid["a" /* default */],
    KvPageContainer: KvPageContainer["a" /* default */],
    SectionWithBackgroundClassic: SectionWithBackgroundClassic["a" /* default */],
    KvContentfulImg: KvContentfulImg["default"]
  },
  mixins: [contentful_ui_setting_styles_mixin["a" /* default */]],
  props: {
    content: {
      type: Object,
      default: function _default() {}
    }
  },
  computed: {
    sectionBackground: function sectionBackground() {
      var _this$content, _this$content$content;

      return (_this$content = this.content) === null || _this$content === void 0 ? void 0 : (_this$content$content = _this$content.contents) === null || _this$content$content === void 0 ? void 0 : _this$content$content.find(function (_ref) {
        var contentType = _ref.contentType;
        return contentType ? contentType === 'background' : false;
      });
    },
    contentfulMediaItems: function contentfulMediaItems() {
      var _this$content$media, _this$content2;

      var mediaItemsContentfulData = (_this$content$media = (_this$content2 = this.content) === null || _this$content2 === void 0 ? void 0 : _this$content2.media) !== null && _this$content$media !== void 0 ? _this$content$media : [];
      return mediaItemsContentfulData;
    },
    itemClasses: function itemClasses() {
      return ['tw-col-span-6', {
        'md:tw-col-span-4': this.contentfulMediaItems.length >= 6,
        'lg:tw-col-span-2': this.contentfulMediaItems.length >= 6
      }];
    }
  }
});
// CONCATENATED MODULE: ./src/components/Contentful/MediaItemsCentered.vue?vue&type=script&lang=js&
 /* harmony default export */ var Contentful_MediaItemsCenteredvue_type_script_lang_js_ = (MediaItemsCenteredvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/Contentful/MediaItemsCentered.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Contentful_MediaItemsCenteredvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var MediaItemsCentered = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"MediaItemsCentered","exportName":"default","description":"","tags":{},"props":[{"name":"content","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);