import{L as o}from"./entry-LoanDescription-CEChet9y46.js";import{x as R,A as t,y as z,z as _}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-loanUtils-Dm0t5xUMSO.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-PreviousLoanDescription-wIjaERWm9q.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-index-CWclSTHHJk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-KvExpandable-DdLHYiWgsL.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvIconButton-Cp7d5elHIr.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvTextLink-BPc_eRn_zN.js";import"./entry-KvLoadingParagraph-b8Fmh92Ska.js";import"./entry-getCacheKey-DzwUUocZCb.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-KvLightbox-DVXBz7pz3Z.js";import"./entry-printing-CRk90741Y_.js";const V={title:"Components/BorrowerProfile/LoanDescription",component:o},s={loanId:2413188,anonymizationLevel:"",borrowerOrGroupName:"Wanda",borrowerCount:1,borrowers:[],storyDescription:"Wanda runs a small market stall and would like a loan to buy more inventory. (Placeholder text for layout testing.)",descriptionInOriginalLanguage:"Wanda tiene un pequeño puesto en el mercado y desea un préstamo para comprar más inventario. (Texto de ejemplo.)",originalLanguage:{id:"2",name:"Spanish"},partnerName:"AFODENIC",reviewer:{bylineName:"Rita Rocket",showName:!0},previousLoanId:0},n=()=>({components:{LoanDescription:o},template:"<loan-description />"}),r=()=>({components:{LoanDescription:o},data:()=>({...s,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),e=()=>({components:{LoanDescription:o},data:()=>({...s,anonymizationLevel:"pii",borrowerOrGroupName:t,storyDescription:_,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'}),E={borrowerOrGroupName:"Sample Group",borrowerCount:3,borrowers:[{id:1,firstName:"Wanda"},{id:2,firstName:"Lucy"},{id:3,firstName:"Rita"}]},a=()=>({components:{LoanDescription:o},data:()=>({...s,...E,anonymizationLevel:""}),template:'<loan-description v-bind="$data" />'}),i=()=>({components:{LoanDescription:o},data:()=>({...s,...E,anonymizationLevel:"pii",borrowerOrGroupName:z,borrowers:[{id:1,firstName:t},{id:2,firstName:t},{id:3,firstName:t}],storyDescription:R,descriptionInOriginalLanguage:""}),template:'<loan-description v-bind="$data" />'});var p,m,d;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
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
})`,...(v=(D=i.parameters)==null?void 0:D.docs)==null?void 0:v.source}}};const X=["Loading","PartnerLoanTranslated","PiiAnonymized","GroupLoan","GroupLoanAnonymized"];export{a as GroupLoan,i as GroupLoanAnonymized,n as Loading,r as PartnerLoanTranslated,e as PiiAnonymized,X as __namedExportsOrder,V as default};
