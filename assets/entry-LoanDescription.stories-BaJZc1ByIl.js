import{L as n}from"./entry-LoanDescription-Cz6wQhWvdH.js";import{g as b,A as i,h as D,i as v}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-loanUtils-BMxTMkkMAR.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-PreviousLoanDescription-C-sRC8lzlZ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-stringParserUtils-DNVsfKTBwa.js";import"./entry-KvExpandable-BBEGRXAsk_.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTextLink-BLbKD4J9hR.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";const q={title:"Components/BorrowerProfile/LoanDescription",component:n},t={loanId:2413188,anonymizationLevel:"",borrowerOrGroupName:"Wanda",borrowerCount:1,borrowers:[],storyDescription:"Wanda runs a small market stall and would like a loan to buy more inventory. (Placeholder text for layout testing.)",descriptionInOriginalLanguage:"Wanda tiene un pequeño puesto en el mercado y desea un préstamo para comprar más inventario. (Texto de ejemplo.)",originalLanguage:{id:"2",name:"Spanish"},partnerName:"AFODENIC",reviewer:{bylineName:"Rita Rocket",showName:!0},previousLoanId:0},o=()=>({components:{LoanDescription:n},data:()=>({...t,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),r=()=>({components:{LoanDescription:n},data:()=>({...t,anonymizationLevel:"pii",borrowerOrGroupName:i,storyDescription:v,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'}),A={borrowerOrGroupName:"Sample Group",borrowerCount:3,borrowers:[{id:1,firstName:"Wanda"},{id:2,firstName:"Lucy"},{id:3,firstName:"Rita"}]},e=()=>({components:{LoanDescription:n},data:()=>({...t,...A,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),a=()=>({components:{LoanDescription:n},data:()=>({...t,...A,anonymizationLevel:"pii",borrowerOrGroupName:D,borrowers:[{id:1,firstName:i},{id:2,firstName:i},{id:3,firstName:i}],storyDescription:b,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'});var s,p,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    anonymizationLevel: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(m=(p=o.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var d,c,l;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    anonymizationLevel: 'pii',
    borrowerOrGroupName: ANONYMIZED_BORROWER_NAME,
    storyDescription: anonymizedLoanDescription,
    descriptionInOriginalLanguage: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var u,N,g;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    ...groupArgs,
    anonymizationLevel: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(g=(N=e.parameters)==null?void 0:N.docs)==null?void 0:g.source}}};var L,O,y;a.parameters={...a.parameters,docs:{...(L=a.parameters)==null?void 0:L.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    ...groupArgs,
    anonymizationLevel: 'pii',
    borrowerOrGroupName: ANONYMIZED_GROUP_NAME,
    borrowers: [{
      id: 1,
      firstName: ANONYMIZED_BORROWER_NAME
    }, {
      id: 2,
      firstName: ANONYMIZED_BORROWER_NAME
    }, {
      id: 3,
      firstName: ANONYMIZED_BORROWER_NAME
    }],
    storyDescription: anonymizedGroupLoanDescription,
    descriptionInOriginalLanguage: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(y=(O=a.parameters)==null?void 0:O.docs)==null?void 0:y.source}}};const F=["PartnerLoanTranslated","PiiAnonymized","GroupLoan","GroupLoanAnonymized"];export{e as GroupLoan,a as GroupLoanAnonymized,o as PartnerLoanTranslated,r as PiiAnonymized,F as __namedExportsOrder,q as default};
