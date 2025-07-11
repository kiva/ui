import{a as l}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import i from"./entry-GridLoanCard-CudVA8hqSv.js";import"./entry-ActionButton-CyZS5Qo5_G.js";import"./entry-includes-CAVAVivXb3.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseIndexOf-qfoVQuLp0t.js";import"./entry-_baseFindIndex-Ca62E79BN9.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-get-D3xDH2SX94.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-injectionCheck-CftU0ezdZb.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-basketItems-AJqL_yrdZS.js";import"./entry-updateLoanReservation-BaDuxVurTB.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-KvSecondaryNav-Bp1Uuall6y.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanUtils-5D9a5yj3H7.js";import"./entry-BorrowerInfoHeader-VQmoarrKzl.js";import"./entry-BorrowerInfoName-pU6c4rhCHn.js";import"./entry-BorrowerInfoBody-OSdfQ6Qmfy.js";import"./entry-FundraisingStatus-CilIEKxsLX.js";import"./entry-FundraisingStatusMeter-C86xie2a30.js";import"./entry-LoanCardImage-CcsvNphUkz.js";import"./entry-MatchingText-C4YNqsIWWw.js";import"./entry-LoanTag-BO23Bz811b.js";import"./entry-index-CNzTSTNafD.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CbPSoDvqj7.js";const n={amountLeft:250,expiringSoonMessage:"Only 3 Days Left!",isFavorite:!1,isExpired:!1,isFunded:!1,isSelectedByAnother:!1,isVisitor:!1,itemsInBasket:[1],percentRaised:.4,loan:{id:1,name:"Loan Name",image:{retina:"https://via.placeholder.com/956x720",default:"https://via.placeholder.com/478x360",hash:""},loanAmount:"1250",geocode:{country:{name:"United States",isoCode:"us"}},use:"to buy more fire wood to sell at local market to meet customer demand.",status:"",borrowerCount:2,lenderRepaymentTerm:24,matchingText:"Donation Matcher",userProperties:{lentTo:!1},loanFundraisingInfo:{fundedAmount:1e3,reservedAmount:0,isExpiringSoon:!1},fullLoanUse:"A loan of $1,250 helps to buy more fire wood to sell at local market to meet customer demand."}},Q={title:"Loan Cards/Grid Loan Card",component:i,args:n},e=(c,{argTypes:o})=>({props:Object.keys(o),mixins:[l()],components:{GridLoanCard:i},setup(){return n},template:`
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
    `});var s,r,a;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`(_, {
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
})`,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};var m,p,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`(_, {
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
})`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const W=["Default","Tags"];export{e as Default,t as Tags,W as __namedExportsOrder,Q as default};
