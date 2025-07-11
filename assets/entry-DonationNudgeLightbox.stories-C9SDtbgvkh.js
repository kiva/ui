import{D as i}from"./entry-DonationNudgeLightbox-7tjT82vKNw.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-KvSecondaryNav-Bp1Uuall6y.js";import"./entry-KvTextInput-Pm5YUpay3x.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-settingsUtils-BglWvcCZaO.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvLightbox-kjwZIaJoj5.js";const m={visible:!0},M={title:"Components/Donation Nudge Lightbox",component:i,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:i},mixins:[s(),p()],setup(){return r},template:`
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
        `});var t,n,e;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`(args, {
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
})`,...(e=(n=o.parameters)==null?void 0:n.docs)==null?void 0:e.source}}};const N=["Default"];export{o as Default,N as __namedExportsOrder,M as default};
