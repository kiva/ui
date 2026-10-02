import{a as l}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import i from"./entry-GridLoanCard-D90j7qnY--.js";import"./entry-ActionButton-DH9LR5paCT.js";import"./entry-includes-Dpg0PiJpbb.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseIndexOf-qfoVQuLp0t.js";import"./entry-_baseFindIndex-Ca62E79BN9.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-get-CadldcjCrg.js";import"./entry-toInteger-sFBEvOuEHH.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-get-URTN0AnQsa.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-LendAmountButton-Dm4ASxCjvm.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-updateLoanReservation-BaDuxVurTB.js";import"./entry-basketUtils-CjhIUDfBlL.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-basketItems-B-09YWrzPC.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-index-wdAbQbDo4G.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanUtils-Dm0t5xUMSO.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-KvSelect-Du3NS2t3ME.js";import"./entry-mdi-BJsnkeP_LR.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-BorrowerInfoHeader-DrLTvnFSTv.js";import"./entry-BorrowerInfoName-To0Yh5H3VA.js";import"./entry-BorrowerInfoBody-8AEWVp8_YW.js";import"./entry-FundraisingStatus-yrFPklRiDf.js";import"./entry-FundraisingStatusMeter-BJvhYfOLga.js";import"./entry-LoanCardImage-CXFzRYvERC.js";import"./entry-MatchingText-2l3Q8Z-vu7.js";import"./entry-LoanTag-WOwcmE5BqG.js";import"./entry-index-B2fPe4RJm7.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";const r={amountLeft:250,expiringSoonMessage:"Only 3 Days Left!",isFavorite:!1,isExpired:!1,isFunded:!1,isSelectedByAnother:!1,isVisitor:!1,itemsInBasket:[1],percentRaised:.4,loan:{id:1,name:"Loan Name",image:{retina:"https://via.placeholder.com/956x720",default:"https://via.placeholder.com/478x360",hash:""},loanAmount:"1250",geocode:{country:{name:"United States",isoCode:"us"}},use:"to buy more fire wood to sell at local market to meet customer demand.",status:"",borrowerCount:2,lenderRepaymentTerm:24,matchingText:"Donation Matcher",userProperties:{lentTo:!1},loanFundraisingInfo:{fundedAmount:1e3,reservedAmount:0,isExpiringSoon:!1},fullLoanUse:"A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand."}},ae={title:"Loan Cards/Grid Loan Card",component:i,args:r},e=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return r},template:`
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
    `}),t=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return r},template:`
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
    `});var n,s,a;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`(_, {
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
})`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const me=["Default","Tags"];export{e as Default,t as Tags,me as __namedExportsOrder,ae as default};
