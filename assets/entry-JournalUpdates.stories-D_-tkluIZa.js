import{J as r}from"./entry-JournalUpdates-DcK5SOIhOK.js";import{a as l}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as d}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as c}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as e,c as y,t as x}from"./entry-mockLoanFixtures-4xHHxu25DF.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-purify.es-bRchjNq8Ei.js";import"./entry-KvSocialShareButton-DujjVFUrS4.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvLightbox-hUYJDS8EdG.js";import"./entry-printing-Clr_ahK9Wi.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";const a=x({id:2000099,updates:{totalCount:0,values:[],__typename:"UpdateCollection"}}),G={title:"Components/BorrowerProfile/JournalUpdates",component:r},o=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(e)}),d(),c],template:`<journal-updates :loan-id="${e.id}" />`}),t=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(a)}),d(),c],template:`<journal-updates :loan-id="${a.id}" />`});var n,i,s;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
  components: {
    JournalUpdates
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<journal-updates :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(s=(i=o.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};var p,m,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    JournalUpdates
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(noUpdatesLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<journal-updates :loan-id="\${noUpdatesLoan.id}" />\`
})`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const H=["Default","NoUpdates"];export{o as Default,t as NoUpdates,H as __namedExportsOrder,G as default};
