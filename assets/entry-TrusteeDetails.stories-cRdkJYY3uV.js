import{T as s}from"./entry-TrusteeDetails-CMaLqAmlMD.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-DescriptionListItem-D8mmbzgMV5.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTextLink-BLbKD4J9hR.js";const P={title:"Components/BorrowerProfile/TrusteeDetails",component:s},n={borrowerName:"Sample borrower",trusteeName:"Willy Wonka",endorsement:"This borrower has been endorsed by a local Kiva trustee.",numLoansEndorsedPublic:342,totalLoansValue:"1875000.00",numDefaultedLoans:7,repaymentRate:98,trusteeId:12345},e=()=>({components:{TrusteeDetails:s},data:()=>({...n}),template:'<trustee-details v-bind="$data" />'});e.storyName="Trustee (with endorsement)";const t=()=>({components:{TrusteeDetails:s},data:()=>({...n,endorsement:""}),template:'<trustee-details v-bind="$data" />'}),r=()=>({components:{TrusteeDetails:s},data:()=>({...n,trusteeName:"No Trustee Endorsement",endorsement:"",numLoansEndorsedPublic:0,totalLoansValue:"0.00",numDefaultedLoans:0,repaymentRate:0}),template:'<trustee-details v-bind="$data" />'});var a,o,m;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`() => ({
  components: {
    TrusteeDetails
  },
  data: () => ({
    ...baseTrustee
  }),
  template: '<trustee-details v-bind="$data" />'
})`,...(m=(o=e.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};var d,u,i;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => ({
  components: {
    TrusteeDetails
  },
  data: () => ({
    ...baseTrustee,
    endorsement: ''
  }),
  template: '<trustee-details v-bind="$data" />'
})`,...(i=(u=t.parameters)==null?void 0:u.docs)==null?void 0:i.source}}};var p,l,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    TrusteeDetails
  },
  data: () => ({
    ...baseTrustee,
    trusteeName: 'No Trustee Endorsement',
    endorsement: '',
    numLoansEndorsedPublic: 0,
    totalLoansValue: '0.00',
    numDefaultedLoans: 0,
    repaymentRate: 0
  }),
  template: '<trustee-details v-bind="$data" />'
})`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const S=["WithEndorsement","WithoutEndorsementText","NoTrusteeEndorsement"];export{r as NoTrusteeEndorsement,e as WithEndorsement,t as WithoutEndorsementText,S as __namedExportsOrder,P as default};
