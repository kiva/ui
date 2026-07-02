import{M as t}from"./entry-MoreAboutLoan-Dljaw6u160.js";import{a}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{c as i}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as s}from"./entry-kv-auth0-story-mixin-BRHRk4UM8F.js";import{a as f,f as n,c as m}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-loanUtils-BMxTMkkMAR.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-CWclSTHHJk.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./iframe-LCVN7OV2.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-KvTextLink-BLbKD4J9hR.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-syncDate-BCBV0fzsYm.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";const K={title:"Components/BorrowerProfile/MoreAboutLoan",component:t},l={...f,__typename:"LoanDirect",businessName:"Sample Business",businessDescription:"This business sells household goods and would like a loan to buy more inventory. (Placeholder text.)",purpose:"To buy more inventory for the business.",yearsInBusiness:5,socialLinks:{etsy:null,facebook:null,instagram:null,linkedin:null,twitter:null,website:"https://example.com",yelp:null}},p={...n,__typename:"LoanPartner",partnerName:"AFODENIC",partner:{id:100,loanAlertText:""},dualStatementNote:"",moreInfoAboutLoan:"This loan helps small-business owners invest in their businesses and support their families."},o=()=>({components:{MoreAboutLoan:t},mixins:[a({queryResult:m(l)}),i(),s],template:`<more-about-loan :loan-id="${l.id}" />`}),e=()=>({components:{MoreAboutLoan:t},mixins:[a({queryResult:m(p)}),i(),s],template:`<more-about-loan :loan-id="${p.id}" />`}),r=()=>({components:{MoreAboutLoan:t},mixins:[a({queryResult:m(n),loading:!0}),i(),s],template:`<more-about-loan :loan-id="${n.id}" />`});var u,c,d;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(directLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${directLoan.id}" />\`
})`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var y,L,b;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(partnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${partnerLoan.id}" />\`
})`,...(b=(L=e.parameters)==null?void 0:L.docs)==null?void 0:b.source}}};var x,S,M;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan),
    loading: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(M=(S=r.parameters)==null?void 0:S.docs)==null?void 0:M.source}}};const U=["DirectLoan","PartnerLoan","Loading"];export{o as DirectLoan,r as Loading,e as PartnerLoan,U as __namedExportsOrder,K as default};
