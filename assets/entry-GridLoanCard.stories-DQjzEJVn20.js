import{a as l}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import i from"./entry-GridLoanCard-Cg1nAU0m0G.js";import"./entry-ActionButton-vcf6OiW63R.js";import"./entry-includes-CUMxW66W0P.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseIndexOf-qfoVQuLp0t.js";import"./entry-_baseFindIndex-Ca62E79BN9.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-get-ClabG2OWPD.js";import"./entry-toInteger-sFBEvOuEHH.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-LendAmountButton-jWsrotvgvl.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-updateLoanReservation-BaDuxVurTB.js";import"./entry-basketUtils-mBOuftMGtl.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-basketItems-B-09YWrzPC.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-index-C1c4cvJ8FT.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanUtils-BXS_2y9zuz.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-BorrowerInfoHeader-DGsHDxuuEY.js";import"./entry-BorrowerInfoName-DcjwdUsjEI.js";import"./entry-BorrowerInfoBody-D1JH-r_eBR.js";import"./entry-FundraisingStatus-BiOYAzfj08.js";import"./entry-FundraisingStatusMeter-DiUjznBtbc.js";import"./entry-LoanCardImage-bGLxVKl6U-.js";import"./entry-MatchingText-BnW-YihS6D.js";import"./entry-LoanTag-DtpjgLuCqG.js";const n={amountLeft:250,expiringSoonMessage:"Only 3 Days Left!",isFavorite:!1,isExpired:!1,isFunded:!1,isSelectedByAnother:!1,isVisitor:!1,itemsInBasket:[1],percentRaised:.4,loan:{id:1,name:"Loan Name",image:{retina:"https://via.placeholder.com/956x720",default:"https://via.placeholder.com/478x360",hash:""},loanAmount:"1250",geocode:{country:{name:"United States",isoCode:"us"}},use:"to buy more fire wood to sell at local market to meet customer demand.",status:"",borrowerCount:2,lenderRepaymentTerm:24,matchingText:"Donation Matcher",userProperties:{lentTo:!1},loanFundraisingInfo:{fundedAmount:1e3,reservedAmount:0,isExpiringSoon:!1},fullLoanUse:"A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand."}},te={title:"Loan Cards/Grid Loan Card",component:i,args:n},e=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return n},template:`
        <grid-loan-card
            :items-in-basket="itemsInBasket"
            :loan="loan"
            :amount-left="amountLeft"
            :expiring-soon-message="expiringSoonMessage"
            :is-favorite="isFavorite"
            :is-funded="isFunded"
            :is-selected-by-another="isSelectedByAnother"
            :is-visitor="isVisitor"
            :percent-raised="percentRaised"
            :title="title"
        />
    `}),t=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return n},template:`
        <grid-loan-card
            :items-in-basket="itemsInBasket"
            :loan="loan"
            :amount-left="amountLeft"
            :expiring-soon-message="expiringSoonMessage"
            :is-favorite="isFavorite"
            :is-funded="isFunded"
            :is-selected-by-another="isSelectedByAnother"
            :is-visitor="isVisitor"
            :percent-raised="percentRaised"
            :title="title"
            :show-tags="true"
        />
    `});var r,s,a;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin()],
  components: {
    GridLoanCard
  },
  setup() {
    return args;
  },
  template: \`
        <grid-loan-card
            :items-in-basket="itemsInBasket"
            :loan="loan"
            :amount-left="amountLeft"
            :expiring-soon-message="expiringSoonMessage"
            :is-favorite="isFavorite"
            :is-funded="isFunded"
            :is-selected-by-another="isSelectedByAnother"
            :is-visitor="isVisitor"
            :percent-raised="percentRaised"
            :title="title"
        />
    \`
})`,...(a=(s=e.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var m,p,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin()],
  components: {
    GridLoanCard
  },
  setup() {
    return args;
  },
  template: \`
        <grid-loan-card
            :items-in-basket="itemsInBasket"
            :loan="loan"
            :amount-left="amountLeft"
            :expiring-soon-message="expiringSoonMessage"
            :is-favorite="isFavorite"
            :is-funded="isFunded"
            :is-selected-by-another="isSelectedByAnother"
            :is-visitor="isVisitor"
            :percent-raised="percentRaised"
            :title="title"
            :show-tags="true"
        />
    \`
})`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const oe=["Default","Tags"];export{e as Default,t as Tags,oe as __namedExportsOrder,te as default};
