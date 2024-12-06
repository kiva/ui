import{D as t}from"./entry-DepositIncentiveBanner-DOH5pTRZgt.js";import{c as l}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-GenericPromoBanner-SectafbapW.js";import"./entry-KvIcon-CF0y9QbOxA.js";import"./iframe-CP4Mwuto.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvProgressBar-DoEPy2EJkw.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";const j={title:"WwwFrame/Banners/DepositIncentiveBanner",component:t},d=e=>({readQuery(){return e},query(){return Promise.resolve(e)},watchQuery(){return{subscribe(){}}}}),u={my:{id:1017469,depositIncentiveAmountToLend:25},shop:{id:1,basket:{id:1,totals:{loanReservationTotal:15}},__typename:"Shop"}},o=(e,{argTypes:r})=>({props:Object.keys(r),mixins:[l()],components:{DepositIncentiveBanner:t},provide:{apollo:d({})},template:`
        <deposit-incentive-banner />
    `}),n=(e,{argTypes:r})=>({props:Object.keys(r),mixins:[l()],components:{DepositIncentiveBanner:t},provide:{apollo:d(u)},template:`
        <deposit-incentive-banner />
    `});var i,p,s;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
  components: {
    DepositIncentiveBanner
  },
  provide: {
    apollo: provideMockedApollo({})
  },
  template: \`
        <deposit-incentive-banner />
    \`
})`,...(s=(p=o.parameters)==null?void 0:p.docs)==null?void 0:s.source}}};var a,c,m;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
  components: {
    DepositIncentiveBanner
  },
  provide: {
    apollo: provideMockedApollo(userInfo)
  },
  template: \`
        <deposit-incentive-banner />
    \`
})`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const A=["Default","WithBalance"];export{o as Default,n as WithBalance,A as __namedExportsOrder,j as default};
