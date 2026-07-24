import{M as t}from"./entry-MoreAboutLoan-DZK36mPJB7.js";import{a as n}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as i}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as a}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import{a as f,f as S,c as M}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-loanUtils-D_zTGanKUU.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-index-CWclSTHHJk.js";import"./iframe-BW8Ws25b.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-KvTextLink-C1IR_OG8XM.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";const K={title:"Components/BorrowerProfile/MoreAboutLoan",component:t},s={...f,__typename:"LoanDirect",businessName:"Sample Business",businessDescription:"This business sells household goods and would like a loan to buy more inventory. (Placeholder text.)",purpose:"To buy more inventory for the business.",yearsInBusiness:5,socialLinks:{etsy:null,facebook:null,instagram:null,linkedin:null,twitter:null,website:"https://example.com",yelp:null}},m={...S,__typename:"LoanPartner",partnerName:"AFODENIC",partner:{id:100,loanAlertText:""},dualStatementNote:"",moreInfoAboutLoan:"This loan helps small-business owners invest in their businesses and support their families."},o=()=>({components:{MoreAboutLoan:t},mixins:[n({queryResult:M(s)}),i(),a],template:`<more-about-loan :loan-id="${s.id}" />`}),e=()=>({components:{MoreAboutLoan:t},mixins:[n({queryResult:M(m)}),i(),a],template:`<more-about-loan :loan-id="${m.id}" />`}),r=()=>({components:{MoreAboutLoan:t},mixins:[n({queryResult:new Promise(()=>{})}),i(),a],template:`<more-about-loan :loan-id="${S.id}" />`});var p,l,u;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(directLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${directLoan.id}" />\`
})`,...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var c,d,y;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(partnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${partnerLoan.id}" />\`
})`,...(y=(d=e.parameters)==null?void 0:d.docs)==null?void 0:y.source}}};var L,b,x;r.parameters={...r.parameters,docs:{...(L=r.parameters)==null?void 0:L.docs,source:{originalSource:`() => ({
  components: {
    MoreAboutLoan
  },
  mixins: [apolloStoryMixin({
    queryResult: new Promise(() => {})
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<more-about-loan :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const U=["DirectLoan","PartnerLoan","Loading"];export{o as DirectLoan,r as Loading,e as PartnerLoan,U as __namedExportsOrder,K as default};
