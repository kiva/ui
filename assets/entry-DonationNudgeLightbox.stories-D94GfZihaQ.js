import{D as e}from"./entry-DonationNudgeLightbox-BPIU6jZKBs.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvTextInput-PtyG7zaCU-.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-mdi-DelXZw8dIC.js";import"./entry-KvMaterialIcon-D8DnGkc65h.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-attrs-_14vz2sMym.js";import"./entry-KvButton-CplWdZYNKD.js";import"./entry-KvLoadingSpinner-BFva1V4s4F.js";import"./entry-mdi-Dz4iKpiukw.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-settingsUtils-nNCo416cgf.js";import"./entry-get-pjbUt-rccH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvLightbox-CQmar74Dk6.js";const m={visible:!0},T={title:"Components/Donation Nudge Lightbox",component:e,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:e},mixins:[s(),p()],setup(){return r},template:`
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
})`,...(i=(n=o.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};const C=["Default"];export{o as Default,C as __namedExportsOrder,T as default};
