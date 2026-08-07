import{L as o}from"./entry-LoanDescription-BcFw9A4MEs.js";import{w as R,A as t,x as w,y as z}from"./entry-mockLoanFixtures-4xHHxu25DF.js";import"./entry-loanUtils-Dh5pODnjhO.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-PreviousLoanDescription-CbxyHTDI6o.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-KvExpandable-otp5Py9Dub.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvIconButton-DJIrpVP3Wh.js";import"./entry-KvTextLink-DqLn7K5FjE.js";import"./entry-KvLoadingParagraph-BH4NbwLTpr.js";import"./entry-getCacheKey-BL63flrxkn.js";import"./entry-KvLightbox-hUYJDS8EdG.js";import"./entry-printing-Clr_ahK9Wi.js";const oo={title:"Components/BorrowerProfile/LoanDescription",component:o},s={loanId:2413188,anonymizationLevel:"",borrowerOrGroupName:"Wanda",borrowerCount:1,borrowers:[],storyDescription:"Wanda runs a small market stall and would like a loan to buy more inventory. (Placeholder text for layout testing.)",descriptionInOriginalLanguage:"Wanda tiene un pequeño puesto en el mercado y desea un préstamo para comprar más inventario. (Texto de ejemplo.)",originalLanguage:{id:"2",name:"Spanish"},partnerName:"AFODENIC",reviewer:{bylineName:"Rita Rocket",showName:!0},previousLoanId:0},n=()=>({components:{LoanDescription:o},template:"<loan-description />"}),r=()=>({components:{LoanDescription:o},data:()=>({...s,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),e=()=>({components:{LoanDescription:o},data:()=>({...s,anonymizationLevel:"pii",borrowerOrGroupName:t,storyDescription:z,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'}),E={borrowerOrGroupName:"Sample Group",borrowerCount:3,borrowers:[{id:1,firstName:"Wanda"},{id:2,firstName:"Lucy"},{id:3,firstName:"Rita"}]},a=()=>({components:{LoanDescription:o},data:()=>({...s,...E,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),i=()=>({components:{LoanDescription:o},data:()=>({...s,...E,anonymizationLevel:"pii",borrowerOrGroupName:w,borrowers:[{id:1,firstName:t},{id:2,firstName:t},{id:3,firstName:t}],storyDescription:R,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'});var p,m,d;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  template: '<loan-description />'
})`,...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var c,l,u;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    anonymizationLevel: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(u=(l=r.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var N,L,g;e.parameters={...e.parameters,docs:{...(N=e.parameters)==null?void 0:N.docs,source:{originalSource:`() => ({
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
})`,...(g=(L=e.parameters)==null?void 0:L.docs)==null?void 0:g.source}}};var O,y,A;a.parameters={...a.parameters,docs:{...(O=a.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
  components: {
    LoanDescription
  },
  data: () => ({
    ...baseArgs,
    ...groupArgs,
    anonymizationLevel: ''
  }),
  template: '<loan-description v-bind="$data" />'
})`,...(A=(y=a.parameters)==null?void 0:y.docs)==null?void 0:A.source}}};var b,D,v;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
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
})`,...(v=(D=i.parameters)==null?void 0:D.docs)==null?void 0:v.source}}};const no=["Loading","PartnerLoanTranslated","PiiAnonymized","GroupLoan","GroupLoanAnonymized"];export{a as GroupLoan,i as GroupLoanAnonymized,n as Loading,r as PartnerLoanTranslated,e as PiiAnonymized,no as __namedExportsOrder,oo as default};
