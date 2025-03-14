import{D as e}from"./entry-DonationNudgeLightbox-C_sD9uKtpU.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvButton-C2Rfb78T-Q.js";import"./entry-KvLoadingSpinner-u2JVVBVj2i.js";import"./entry-KvWideLoanCard-M9KpJ2J73i.js";import"./entry-KvTextInput-DcbiRh0S5M.js";import"./entry-KvMaterialIcon-Df-hQ8Uinv.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-settingsUtils-DSo0EGYi0D.js";import"./entry-get-DbzAqeWMpB.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvLightbox-Bgf-XtuQFb.js";const m={visible:!0},I={title:"Components/Donation Nudge Lightbox",component:e,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:e},mixins:[s(),p()],setup(){return r},template:`
        <donation-nudge-lightbox
            :loan-count="1"
            :loan-reservation-total="25"
            :visible="visible"
            :close-nudge-lightbox="() => {}"
            :update-donation-to="() => {}"
            :has-custom-donation="false"
            description="Lorem Ipsum"
            :current-donation-amount="'3.75'"
         />
        `});var t,n,i;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    DonationNudgeLightbox
  },
  mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
  setup() {
    return args;
  },
  template: \`
        <donation-nudge-lightbox
            :loan-count="1"
            :loan-reservation-total="25"
            :visible="visible"
            :close-nudge-lightbox="() => {}"
            :update-donation-to="() => {}"
            :has-custom-donation="false"
            description="Lorem Ipsum"
            :current-donation-amount="'3.75'"
         />
        \`
})`,...(i=(n=o.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};const T=["Default"];export{o as Default,T as __namedExportsOrder,I as default};
