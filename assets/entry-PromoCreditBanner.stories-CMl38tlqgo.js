import{P as o}from"./entry-PromoCreditBanner-CCrPa6t4Rf.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-promoCredit-A8tDfJh8uJ.js";import"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const i={basketState:{shop:{nonTrivialItemCount:1,basket:{id:12,hasFreeCredits:!0,credits:{values:{id:12,available:!0,creditType:"bonus_credit",promoFund:{id:12,displayName:"test"}}},totals:{bonusAvailableTotal:124312.23,freeTrialAvailableTotal:2432.342,redemptionCodeAvailableTotal:24.241,universalCodeAvailableTotal:234}}},my:{userAccount:{id:1017469,balance:"0.00",promoBalance:"10.00"},lender:{image:{id:726677,url:"https://www.kiva.org/img/s140/726677.webp"}},isBorrower:!1,mostRecentBorrowedLoan:null,trustee:null}}},b={title:"WwwFrame/Banners/PromoCreditBanner",component:o,args:i},e=(s,{argTypes:n})=>({props:Object.keys(n),components:{PromoCreditBanner:o},setup(){return s},template:`
        <promo-credit-banner :basket-state="basketState" />
    `});var t,r,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    PromoCreditBanner
  },
  setup() {
    return args;
  },
  template: \`
        <promo-credit-banner :basket-state="basketState" />
    \`
})`,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,b as default};
