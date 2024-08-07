(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[569],{

/***/ 5894:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/Error.vue?vue&type=template&id=136a1f3a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('www-page',{staticClass:"ui-error-page"},[_c('kv-default-wrapper',{staticClass:"tw-text-center tw-prose"},[(_vm.errorDescription === 'force_password_reset')?[_c('h1',[_vm._v(_vm._s(_vm.messages.headline))]),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.messages.reason))]),_vm._v(" "),(_vm.loginRedirectUrl)?_c('p',{staticClass:"message"},[_vm._v("\n\t\t\t\t"+_vm._s(_vm.messages.please)+"\n\t\t\t\t"),_c('a',{attrs:{"href":("" + _vm.loginRedirectUrl)}},[_vm._v(_vm._s(_vm.messages.login))]),_vm._v("\n\t\t\t\t"+_vm._s(_vm.messages.clickForgot)+"\n\t\t\t")]):_vm._e()]:[_c('h1',[_vm._v("Oh no, something went wrong!")]),_vm._v(" "),(_vm.description)?_c('h2',[_vm._v("\n\t\t\t\t"+_vm._s(_vm.description)+"\n\t\t\t")]):_vm._e(),_vm._v(" "),(_vm.loginRedirectUrl)?_c('p',{staticClass:"message"},[_vm._v("\n\t\t\t\tPlease "),_c('a',{attrs:{"href":("" + _vm.loginRedirectUrl)}},[_vm._v("try again.")])]):_vm._e()],_vm._v(" "),_c('p',[_vm._v("\n\t\t\t"+_vm._s(_vm.messages.contact)+"\n\t\t\t"),_c('a',{staticClass:"data-hj-suppress",attrs:{"href":("mailto:" + _vm.contactEmail)}},[_vm._v(_vm._s(_vm.contactEmail))])])],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/pages/Error.vue?vue&type=template&id=136a1f3a&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./src/components/WwwFrame/WwwPage.vue + 24 modules
var WwwPage = __webpack_require__(235);

// EXTERNAL MODULE: ./src/util/logFormatter.js
var logFormatter = __webpack_require__(37);

// EXTERNAL MODULE: ./src/components/Kv/KvDefaultWrapper.vue + 4 modules
var KvDefaultWrapper = __webpack_require__(999);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./src/pages/Error.vue?vue&type=script&lang=js&

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable vue/multi-word-component-names */



/* harmony default export */ var Errorvue_type_script_lang_js_ = ({
  name: 'Error',
  inject: ['locale'],
  components: {
    WwwPage: WwwPage["a" /* default */],
    KvDefaultWrapper: KvDefaultWrapper["a" /* default */]
  },
  metaInfo: {
    title: 'Error'
  },
  data: function data() {
    return {
      errorCode: this.$route.query.error,
      errorDescription: this.$route.query.error_description,
      clientId: this.$route.query.client_id,
      lenderLogin: this.$route.query.lender_login !== '0'
    };
  },
  computed: {
    contactEmail: function contactEmail() {
      return this.isPartnerLogin ? 'partnersupport@kiva.org' : 'contactus@kiva.org';
    },
    description: function description() {
      if (this.errorDescription === 'Access expired.') {
        return 'The link emailed to you has expired.';
      }
      return this.errorDescription;
    },
    isPartnerLogin: function isPartnerLogin() {
      return /partners/i.test(this.loginRedirectUrl);
    },
    loginRedirectUrl: function loginRedirectUrl() {
      return this.$appConfig.auth0.loginRedirectUrls[this.clientId];
    },
    messages: function messages() {
      var language = this.locale.substring(0, 2).toLowerCase();
      /* eslint-disable max-len */
      switch (language) {
        case 'es':
          return {
            headline: 'Nueva contraseña requerida',
            reason: 'Ha pasado un tiempo desde que lo hemos visto, entonces necesitamos que usted restablezca su contraseña.',
            please: 'Por favor,',
            login: 'vuelva a iniciar la sesión',
            clickForgot: 'y haga clic en "¿Olvidó su contraseña?" para continuar.',
            contact: 'Si nos necesita, siempre estamos disponibles en'
          };
        case 'fr':
          return {
            headline: 'Nouveau mot de passe requis',
            reason: 'Cela fait un moment que nous ne vous avons pas vu. Donc, nous avons besoin de vous pour réinitialiser votre mot de passe.',
            please: 'Veuillez',
            login: 'revenir à la connexion',
            clickForgot: 'et cliquez sur "Mot de passe oublié?" pour continuer.',
            contact: 'Si vous avez besoin de nous, nous sommes toujours disponibles à'
          };
        default:
          return {
            headline: 'New password required',
            reason: 'It\'s been a while since we\'ve seen you, so we need you to reset your password.',
            please: 'Please,',
            login: 'return to login',
            clickForgot: "and click \"".concat(this.forgotPasswordText, "\" to continue."),
            contact: 'If you need us, we\'re always available at'
          };
      }
      /* eslint-enable max-len */
    },
    forgotPasswordText: function forgotPasswordText() {
      return this.lenderLogin ? 'Forgot your password?' : 'Don\'t remember your password?';
    }
  },
  created: function created() {
    Object(logFormatter["a" /* default */])("Auth0 authentication error: ".concat(this.errorCode, ": ").concat(this.errorDescription), 'warn', _objectSpread({}, this.$route.query));
  }
});
// CONCATENATED MODULE: ./src/pages/Error.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_Errorvue_type_script_lang_js_ = (Errorvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/pages/Error.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_Errorvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var Error = __webpack_exports__["default"] = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"displayName":"Error","exportName":"default","description":"","tags":{}}

/***/ })

}]);