import{a as l}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import i from"./entry-GridLoanCard-CQICgCsGx0.js";import"./entry-ActionButton-7t4_eq-eOI.js";import"./entry-includes-DexPHvPVPt.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-_baseIndexOf-Dp1luNUYT3.js";import"./entry-_baseFindIndex-Ct0WiHaBIz.js";import"./entry-keys-CWqrnc1fyR.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-_baseToString-C08wEDsWoH.js";import"./entry-toInteger-ByE7uYhomK.js";import"./entry-toNumber-BfkLXMgxIK.js";import"./entry-get-iRc4pJ7r6H.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-updateLoanReservation-CMshdCI3Lr.js";import"./entry-basketUtils-DtInboAgbl.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-basketItems-BEDWpZvb7f.js";import"./entry-updateDonation-feoeLdW7rR.js";import"./entry-exports-B6EYZdgWeI.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvButton-CBJoMUsMFr.js";import"./entry-KvLoadingSpinner-qUlMzbXzEe.js";import"./entry-KvWideLoanCard-CfbcqIxttL.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanUtils-CvoIQ-QeVy.js";import"./entry-KvSelect-BpOJJ_hpQ-.js";import"./entry-KvMaterialIcon-Dgz8mJKr4K.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-BorrowerInfoHeader-D4ewzeQyo9.js";import"./entry-BorrowerInfoName-CYTU8OSCJj.js";import"./entry-BorrowerInfoBody-FqBSksRxZd.js";import"./entry-FundraisingStatus-COElltU1Xw.js";import"./entry-FundraisingStatusMeter-BW8_UekkPR.js";import"./entry-LoanCardImage-DBHCbGIU3-.js";import"./entry-MatchingText-Cso7FCYfwX.js";import"./entry-LoanTag-BUCxIhYvYy.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";const r={amountLeft:250,expiringSoonMessage:"Only 3 Days Left!",isFavorite:!1,isExpired:!1,isFunded:!1,isSelectedByAnother:!1,isVisitor:!1,itemsInBasket:[1],percentRaised:.4,loan:{id:1,name:"Loan Name",image:{retina:"https://via.placeholder.com/956x720",default:"https://via.placeholder.com/478x360",hash:""},loanAmount:"1250",geocode:{country:{name:"United States",isoCode:"us"}},use:"to buy more fire wood to sell at local market to meet customer demand.",status:"",borrowerCount:2,lenderRepaymentTerm:24,matchingText:"Donation Matcher",userProperties:{lentTo:!1},loanFundraisingInfo:{fundedAmount:1e3,reservedAmount:0,isExpiringSoon:!1},fullLoanUse:"A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand."}},ne={title:"Loan Cards/Grid Loan Card",component:i,args:r},e=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return r},template:`
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
})`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const se=["Default","Tags"];export{e as Default,t as Tags,se as __namedExportsOrder,ne as default};
