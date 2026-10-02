import{S as i}from"./entry-ShareButton-BkycnXWim0.js";import{a as s}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as p}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{b as o,f as n,c as m}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-mdi-BJsnkeP_LR.js";import"./entry-KvSocialShareButton-Cq5uLuzwin.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLightbox-CTqnmGtx83.js";import"./entry-printing-DMx4lS_4Te.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";const k={title:"Components/BorrowerProfile/ShareButton",component:i},r=()=>({components:{ShareButton:i},mixins:[s({queryResult:m(n,o)}),p()],setup(){return{loan:n,lender:o.userAccount}},template:`
        <share-button
            :loan="loan"
            :lender="lender"
            variant="caution"
            campaign="social_share_bp"
        />
    `});var e,t,a;r.parameters={...r.parameters,docs:{...(e=r.parameters)==null?void 0:e.docs,source:{originalSource:`() => ({
  components: {
    ShareButton
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan, loggedInUser)
  }), cookieStoreStoryMixin()],
  setup() {
    return {
      loan: fundraisingPartnerLoan,
      lender: loggedInUser.userAccount
    };
  },
  template: \`
        <share-button
            :loan="loan"
            :lender="lender"
            variant="caution"
            campaign="social_share_bp"
        />
    \`
})`,...(a=(t=r.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const q=["Default"];export{r as Default,q as __namedExportsOrder,k as default};
