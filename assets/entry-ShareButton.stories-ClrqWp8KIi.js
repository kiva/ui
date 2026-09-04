import{S as i}from"./entry-ShareButton-UrSykSXW3O.js";import{a as s}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as p}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{b as o,f as n,c as m}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-KvSocialShareButton-BiQqLbm2h-.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";const k={title:"Components/BorrowerProfile/ShareButton",component:i},r=()=>({components:{ShareButton:i},mixins:[s({queryResult:m(n,o)}),p()],setup(){return{loan:n,lender:o.userAccount}},template:`
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
