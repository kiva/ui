import{B as n}from"./entry-BorrowerCountry-12H45zo1jx.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as s}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import{f as o,c as M}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvMap-BB1e8Wen8j.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-CountryInfo-C-4flwwrdA.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";const z={title:"Components/BorrowerProfile/BorrowerCountry",component:n},c={...o,geocode:{...o.geocode,latitude:41.5,longitude:75.8}},m={...o,geocode:{...o.geocode,latitude:null,longitude:null}},r=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:M(c)}),a(),s],template:`<borrower-country :loan-id="${c.id}" />`}),e=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:M(m)}),a(),s],template:`<borrower-country :loan-id="${m.id}" />`}),t=()=>({components:{BorrowerCountry:n},mixins:[i({queryResult:new Promise(()=>{})}),a(),s],template:`<borrower-country :loan-id="${o.id}" />`});var p,u,l;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(loanWithGeocode)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${loanWithGeocode.id}" />\`
})`,...(l=(u=r.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var d,y,x;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(loanMissingGeocode)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${loanMissingGeocode.id}" />\`
})`,...(x=(y=e.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var S,g,w;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    BorrowerCountry
  },
  mixins: [apolloStoryMixin({
    queryResult: new Promise(() => {})
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<borrower-country :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(w=(g=t.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};const D=["WithLoanGeocode","FallsBackToCountryGeocode","Loading"];export{e as FallsBackToCountryGeocode,t as Loading,r as WithLoanGeocode,D as __namedExportsOrder,z as default};
