import{J as r}from"./entry-JournalUpdates-CNn46FuxlI.js";import{a as l}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{c as d}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as c}from"./entry-kv-auth0-story-mixin-BRHRk4UM8F.js";import{f as e,c as y,b as x}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-KvSocialShareButton-ByS5XLx_Wt.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CBEp7EZB0S.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-syncDate-BCBV0fzsYm.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";const a=x({id:2000099,updates:{totalCount:0,values:[],__typename:"UpdateCollection"}}),F={title:"Components/BorrowerProfile/JournalUpdates",component:r},o=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(e)}),d(),c],template:`<journal-updates :loan-id="${e.id}" />`}),t=()=>({components:{JournalUpdates:r},mixins:[l({queryResult:y(a)}),d(),c],template:`<journal-updates :loan-id="${a.id}" />`});var n,i,s;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
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
})`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const G=["Default","NoUpdates"];export{o as Default,t as NoUpdates,G as __namedExportsOrder,F as default};
