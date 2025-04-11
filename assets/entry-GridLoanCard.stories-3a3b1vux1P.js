import{a as l}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import i from"./entry-GridLoanCard-ZO6VV2aKMF.js";import"./entry-ActionButton-7E3lsWMyYA.js";import"./entry-includes-DB_sI7PSpa.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseIndexOf-Dp1luNUYT3.js";import"./entry-_baseFindIndex-Ct0WiHaBIz.js";import"./entry-keys-fhc0uxq3pb.js";import"./entry-isSymbol-CW-Mfw5CbL.js";import"./entry-get-B2-KJ0gFYl.js";import"./entry-toInteger-qbckGqxOeY.js";import"./entry-toNumber-DdX6xnS_xy.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-numeral-CmvrP3KSIW.js";import"./entry-updateLoanReservation-CMshdCI3Lr.js";import"./entry-basketUtils-89YV1XC5kY.js";import"./entry-index-DGXt1zOePE.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-basketItems-BEDWpZvb7f.js";import"./entry-updateDonation-feoeLdW7rR.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-BLG9j3cwXD.js";import"./entry-KvButton-TdHxvIkxq1.js";import"./entry-KvLoadingSpinner-pmzcZDogp1.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanUtils-B52LdcM55Z.js";import"./entry-KvSelect-CRyrGIHRgQ.js";import"./entry-KvMaterialIcon-BdbWoAcYP2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-BorrowerInfoHeader-CJzEi3bKzb.js";import"./entry-BorrowerInfoName-B57rd0Zx49.js";import"./entry-BorrowerInfoBody-BY5ppqG3_t.js";import"./entry-FundraisingStatus-BHEtiOiRe6.js";import"./entry-FundraisingStatusMeter-CmeywaLIgC.js";import"./entry-LoanCardImage-oqavy3pHnM.js";import"./entry-MatchingText-xu1QjQtFix.js";import"./entry-LoanTag-CsIylmvUdz.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";const r={amountLeft:250,expiringSoonMessage:"Only 3 Days Left!",isFavorite:!1,isExpired:!1,isFunded:!1,isSelectedByAnother:!1,isVisitor:!1,itemsInBasket:[1],percentRaised:.4,loan:{id:1,name:"Loan Name",image:{retina:"https://via.placeholder.com/956x720",default:"https://via.placeholder.com/478x360",hash:""},loanAmount:"1250",geocode:{country:{name:"United States",isoCode:"us"}},use:"to buy more fire wood to sell at local market to meet customer demand.",status:"",borrowerCount:2,lenderRepaymentTerm:24,matchingText:"Donation Matcher",userProperties:{lentTo:!1},loanFundraisingInfo:{fundedAmount:1e3,reservedAmount:0,isExpiringSoon:!1},fullLoanUse:"A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand."}},ie={title:"Loan Cards/Grid Loan Card",component:i,args:r},e=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return r},template:`
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
})`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const re=["Default","Tags"];export{e as Default,t as Tags,re as __namedExportsOrder,ie as default};
