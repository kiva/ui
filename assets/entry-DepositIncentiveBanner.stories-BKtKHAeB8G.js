import{D as t}from"./entry-DepositIncentiveBanner-0YYxDJbjvq.js";import{c as l}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-GenericPromoBanner-DNQ2TlSfq-.js";import"./entry-KvIcon-BrNY7gjzFb.js";import"./iframe-D9Lm9jvt.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvAtbModal-DBQkdQ0mEi.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvProgressBar-Die9SF9X5I.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";const O={title:"WwwFrame/Banners/DepositIncentiveBanner",component:t},d=e=>({readQuery(){return e},query(){return Promise.resolve(e)},watchQuery(){return{subscribe(){}}}}),u={my:{id:1017469,depositIncentiveAmountToLend:25},shop:{id:1,basket:{id:1,totals:{loanReservationTotal:15}},__typename:"Shop"}},o=(e,{argTypes:r})=>({props:Object.keys(r),mixins:[l()],components:{DepositIncentiveBanner:t},provide:{apollo:d({})},template:`
        <deposit-incentive-banner />
    `}),n=(e,{argTypes:r})=>({props:Object.keys(r),mixins:[l()],components:{DepositIncentiveBanner:t},provide:{apollo:d(u)},template:`
        <deposit-incentive-banner />
    `});var i,s,p;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`(args, {
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
})`,...(p=(s=o.parameters)==null?void 0:s.docs)==null?void 0:p.source}}};var a,c,m;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
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
})`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const _=["Default","WithBalance"];export{o as Default,n as WithBalance,_ as __namedExportsOrder,O as default};
