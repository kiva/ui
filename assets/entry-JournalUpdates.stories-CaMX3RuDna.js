import{J as r}from"./entry-JournalUpdates-C00uVsTYY2.js";import{a as l}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as d}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as c}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as e,c as y,t as x}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-KvButton-C8S99vq6YZ.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-purify.es-CqxHTgmJCD.js";import"./entry-KvSocialShareButton-C1n59ziySh.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvLightbox-DVXBz7pz3Z.js";import"./entry-printing-CRk90741Y_.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";const a=x({id:2000099,updates:{totalCount:0,values:[],__typename:"UpdateCollection"}}),I={title:"Components/BorrowerProfile/JournalUpdates",component:r},o=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(e)}),d(),c],template:`<journal-updates :loan-id="${e.id}" />`}),t=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(a)}),d(),c],template:`<journal-updates :loan-id="${a.id}" />`});var n,i,p;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
  components: {
    JournalUpdates
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<journal-updates :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(p=(i=o.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var s,m,u;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`() => ({
  components: {
    JournalUpdates
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(noUpdatesLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<journal-updates :loan-id="\${noUpdatesLoan.id}" />\`
})`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const K=["Default","NoUpdates"];export{o as Default,t as NoUpdates,K as __namedExportsOrder,I as default};
