import{D as i}from"./entry-DonationNudgeLightbox-DZBmIG-vE9.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as p}from"./entry-apollo-story-mixin-NCMtMfZ7e5.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-settingsUtils-XGNYGjbQmx.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-KvLightbox-DIEHD1eQCo.js";const m={visible:!0},O={title:"Components/Donation Nudge Lightbox",component:i,args:m},o=(r,{argTypes:a})=>({props:Object.keys(a),components:{DonationNudgeLightbox:i},mixins:[s(),p()],setup(){return r},template:`
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
})`,...(e=(n=o.parameters)==null?void 0:n.docs)==null?void 0:e.source}}};const _=["Default"];export{o as Default,_ as __namedExportsOrder,O as default};
