import{D as e}from"./entry-DonationNudgeLightbox-DGBb6AiM0W.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-numeral-CmvrP3KSIW.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvWideLoanCard-UZGuFHBpxm.js";import"./entry-KvButton-CDAm7sgGzJ.js";import"./entry-KvLoadingSpinner-D8lUagFo7U.js";import"./entry-KvTextInput-CJrbQ5q124.js";import"./entry-KvMaterialIcon-Do7tkng7tH.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-DGXt1zOePE.js";import"./entry-settingsUtils-CFNuLM2VJH.js";import"./entry-get-CNsXUaDw28.js";import"./entry-isSymbol-CW-Mfw5CbL.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvLightbox-Cpf3qfGSNd.js";const m={visible:!0},j={title:"Components/Donation Nudge Lightbox",component:e,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:e},mixins:[s(),p()],setup(){return r},template:`
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
})`,...(i=(n=o.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};const I=["Default"];export{o as Default,I as __namedExportsOrder,j as default};
