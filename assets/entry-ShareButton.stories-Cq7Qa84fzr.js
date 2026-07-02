import{S as i}from"./entry-ShareButton-DCaVPVYb5Q.js";import{a as s}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{c as p}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{l as o,f as n,c as m}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-KvSocialShareButton-ByS5XLx_Wt.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-stringParserUtils-DNVsfKTBwa.js";const v={title:"Components/BorrowerProfile/ShareButton",component:i},r=()=>({components:{ShareButton:i},mixins:[s({queryResult:m(n,o)}),p()],setup(){return{loan:n,lender:o.userAccount}},template:`
        <share-button
            :loan="loan"
            :lender="lender"
            variant="caution"
            campaign="social_share_bp"
        />
    `});var t,e,a;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
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
})`,...(a=(e=r.parameters)==null?void 0:e.docs)==null?void 0:a.source}}};const A=["Default"];export{r as Default,A as __namedExportsOrder,v as default};
