import{F as a}from"./entry-FieldPartnerDetails-kV6xdzTdwb.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-DescriptionListItem-D8mmbzgMV5.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTextLink-BLbKD4J9hR.js";const N={title:"Components/BorrowerProfile/FieldPartnerDetails",component:a},n={partnerId:100,partnerName:"AFODENIC",avgBorrowerCost:35,avgBorrowerCostType:"interest",avgProfitability:2.5,arrearsRate:.02,loansAtRiskRate:3,defaultRate:1.25,riskRating:3.5,currencyExchangeLossRate:.05},e=()=>({components:{FieldPartnerDetails:a},data:()=>({...n}),template:'<field-partner-details v-bind="$data" />'}),t=()=>({components:{FieldPartnerDetails:a},data:()=>({...n,avgBorrowerCost:0}),template:'<field-partner-details v-bind="$data" />'}),r=()=>({components:{FieldPartnerDetails:a},data:()=>({...n,riskRating:5}),template:'<field-partner-details v-bind="$data" />'});var o,s,i;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`() => ({
  components: {
    FieldPartnerDetails
  },
  data: () => ({
    ...basePartner
  }),
  template: '<field-partner-details v-bind="$data" />'
})`,...(i=(s=e.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var p,d,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    FieldPartnerDetails
  },
  data: () => ({
    ...basePartner,
    avgBorrowerCost: 0
  }),
  template: '<field-partner-details v-bind="$data" />'
})`,...(l=(d=t.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var m,c,g;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => ({
  components: {
    FieldPartnerDetails
  },
  data: () => ({
    ...basePartner,
    riskRating: 5
  }),
  template: '<field-partner-details v-bind="$data" />'
})`,...(g=(c=r.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};const h=["AllMetrics","NoAverageCost","HighRiskRating"];export{e as AllMetrics,r as HighRiskRating,t as NoAverageCost,h as __namedExportsOrder,N as default};
