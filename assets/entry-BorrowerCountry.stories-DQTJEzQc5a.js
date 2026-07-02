import{B as n}from"./entry-BorrowerCountry-DoOKpX-zwa.js";import{a as i}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as s}from"./entry-kv-auth0-story-mixin-BRHRk4UM8F.js";import{f as o,c}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-KvMap-DBW1EmsCuL.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-CountryInfo-vcqRUpwAgr.js";import"./entry-syncDate-BCBV0fzsYm.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const D={title:"Components/BorrowerProfile/BorrowerCountry",component:n},m={...o,geocode:{...o.geocode,latitude:41.5,longitude:75.8}},u={...o,geocode:{...o.geocode,latitude:null,longitude:null}},r=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:c(m)}),a(),s],template:`<borrower-country :loan-id="${m.id}" />`}),e=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:c(u)}),a(),s],template:`<borrower-country :loan-id="${u.id}" />`}),t=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:c(o),loading:!0}),a(),s],template:`<borrower-country :loan-id="${o.id}" />`});var l,p,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(loanWithGeocode)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${loanWithGeocode.id}" />\`
})`,...(d=(p=r.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var y,x,g;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(loanMissingGeocode)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${loanMissingGeocode.id}" />\`
})`,...(g=(x=e.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var S,M,w;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan),
    loading: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(w=(M=t.parameters)==null?void 0:M.docs)==null?void 0:w.source}}};const H=["WithLoanGeocode","FallsBackToCountryGeocode","Loading"];export{e as FallsBackToCountryGeocode,t as Loading,r as WithLoanGeocode,H as __namedExportsOrder,D as default};
