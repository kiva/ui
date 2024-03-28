(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[568],{

/***/ 5752:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=template&id=1cee5e40&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"tw-py-8 md:tw-py-16"},[_c('div',{staticClass:"row align-center"},[_c('div',{staticClass:"small-12 medium-10 large-6 columns"},[(_vm.partnerImage.url)?_c('kv-contentful-img',{staticClass:"tw-block tw-w-full tw-mx-auto tw-mb-4 md:tw-mb-0",attrs:{"contentful-src":_vm.partnerImage.url,"width":500,"fallback-format":"jpg","loading":"lazy","alt":_vm.partnerImage.title}}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"small-10 large-6 columns"},[(_vm.headline)?_c('h2',{staticClass:"tw-mb-4"},[_vm._v("\n\t\t\t\t"+_vm._s(_vm.headline)+"\n\t\t\t")]):_vm._e(),_vm._v(" "),(_vm.bodyCopy)?_c('div',{ref:"partnerBodyCopy",staticClass:"tw-prose",domProps:{"innerHTML":_vm._s(_vm.bodyCopy)}}):_vm._e()])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=template&id=1cee5e40&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(9);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(5);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./src/util/contentful/richTextRenderer.js
var richTextRenderer = __webpack_require__(386);

// EXTERNAL MODULE: ./src/components/Kv/KvContentfulImg.vue + 4 modules
var KvContentfulImg = __webpack_require__(931);

// EXTERNAL MODULE: ./node_modules/@contentful/rich-text-html-renderer/dist/rich-text-html-renderer.es5.js
var rich_text_html_renderer_es5 = __webpack_require__(81);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var CampaignPartnervue_type_script_lang_js_ = ({
  name: 'CampaignPartner',
  components: {
    KvContentfulImg: KvContentfulImg["a" /* default */]
  },
  props: {
    partnerAreaContent: {
      type: Object,
      default: function _default() {}
    },
    pageSettingData: {
      type: Object,
      default: function _default() {}
    }
  },
  computed: {
    partnerImage: function partnerImage() {
      var _this$partnerAreaCont, _this$partnerAreaCont2, _mediaObject$file;

      var mediaObject = (_this$partnerAreaCont = this.partnerAreaContent) === null || _this$partnerAreaCont === void 0 ? void 0 : (_this$partnerAreaCont2 = _this$partnerAreaCont.media) === null || _this$partnerAreaCont2 === void 0 ? void 0 : _this$partnerAreaCont2[0];
      return {
        title: (mediaObject === null || mediaObject === void 0 ? void 0 : mediaObject.title) || '',
        url: (mediaObject === null || mediaObject === void 0 ? void 0 : (_mediaObject$file = mediaObject.file) === null || _mediaObject$file === void 0 ? void 0 : _mediaObject$file.url) || ''
      };
    },
    headline: function headline() {
      var _this$partnerAreaCont3, _this$partnerAreaCont4, _this$partnerAreaCont5;

      return ((_this$partnerAreaCont3 = this.partnerAreaContent) === null || _this$partnerAreaCont3 === void 0 ? void 0 : (_this$partnerAreaCont4 = _this$partnerAreaCont3.contents) === null || _this$partnerAreaCont4 === void 0 ? void 0 : (_this$partnerAreaCont5 = _this$partnerAreaCont4[0]) === null || _this$partnerAreaCont5 === void 0 ? void 0 : _this$partnerAreaCont5.headline) || '';
    },
    bodyCopy: function bodyCopy() {
      var _this$partnerAreaCont6, _this$partnerAreaCont7, _this$partnerAreaCont8;

      var richText = (_this$partnerAreaCont6 = this.partnerAreaContent) === null || _this$partnerAreaCont6 === void 0 ? void 0 : (_this$partnerAreaCont7 = _this$partnerAreaCont6.contents) === null || _this$partnerAreaCont7 === void 0 ? void 0 : (_this$partnerAreaCont8 = _this$partnerAreaCont7[0]) === null || _this$partnerAreaCont8 === void 0 ? void 0 : _this$partnerAreaCont8.bodyCopy;
      return richText ? Object(rich_text_html_renderer_es5["documentToHtmlString"])(richText) : '';
    }
  },
  mounted: function mounted() {
    var _this = this;

    return asyncToGenerator_default()( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
      return regenerator_default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.$nextTick();

            case 2:
              Object(richTextRenderer["a" /* addBlankTargetToExternalLinks */])(_this.$refs.partnerBodyCopy, _this.pageSettingData);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
});
// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue?vue&type=script&lang=js&
 /* harmony default export */ var CorporateCampaign_CampaignPartnervue_type_script_lang_js_ = (CampaignPartnervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/CorporateCampaign/CampaignPartner.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  CorporateCampaign_CampaignPartnervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var CampaignPartner = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"CampaignPartner","exportName":"default","description":"","tags":{},"props":[{"name":"partnerAreaContent","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}},{"name":"pageSettingData","type":{"name":"object"},"defaultValue":{"func":true,"value":"() => {}"}}]}

/***/ })

}]);