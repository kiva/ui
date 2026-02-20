import{D as e}from"./entry-DonationNudgeLightbox-D7TnLzjat4.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvButton-BA7nBLyz1b.js";import"./entry-KvLoadingSpinner-CpYE5b1xV2.js";import"./entry-KvTextInput-CnVgGp-sYq.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvLightbox-y8nxBJS-RZ.js";const m={visible:!0},T={title:"Components/Donation Nudge Lightbox",component:e,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:e},mixins:[s(),p()],setup(){return r},template:`
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
