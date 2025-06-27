import{R as e}from"./entry-RecommendedLoanCard-BZnoDx9WQP.js";import{a as d}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as l}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-time-left-mixin-uDnxYTFHu3.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-xRmxT6p7Lm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-FundraisingStatusMeter-Cr3NXjDvqq.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvLoadingParagraph-Bz1TPjDK-6.js";import"./entry-getCacheKey-K1ze_RYMi5.js";import"./entry-KvLoadingPlaceholder-DqQtKDngqv.js";import"./entry-KvSecondaryNav-DRnkkPAFON.js";import"./entry-basketItems-AJqL_yrdZS.js";import"./entry-updateLoanReservation-BaDuxVurTB.js";import"./entry-KvButton-DXf6qmENM5.js";import"./entry-KvIcon-BN_uu0qXvk.js";import"./iframe-D_E-a7fZ.js";import"./entry-KvLoadingSpinner-D1xFuzANIX.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-mdi-Jyy_kRgyKq.js";import"./entry-KvMaterialIcon-BLPGYhAoqx.js";import"./entry-KvFlag-DpOkyUkyqN.js";const c={data:{lend:{loan:{id:1998250,geocode:{country:{name:"Malawi",isoCode:"MW"}},image:{default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w480h300/d5ad26cd7acc24317edc1c04c6250074.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w960h600/d5ad26cd7acc24317edc1c04c6250074.jpg"},name:"Microloan Foundation Malawi",sector:{name:"Services"},whySpecial:"It helps Lending Partners withstand negative economic impacts of the COVID-19 pandemic.",userProperties:{lentTo:null},use:"this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",status:"fundraising",loanAmount:"250000.00",borrowerCount:1,anonymizationLevel:"none",fullLoanUse:"A loan of $250,000 helps this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",loanFundraisingInfo:{fundedAmount:"218950.00",reservedAmount:"0.00",isExpiringSoon:!1},plannedExpirationDate:"2020-09-10T19:30:13Z"}}}},W={title:"Loan Cards/Recommended Loan Card",component:e},o=()=>({mixins:[d({queryResult:c}),l()],components:{RecommendedLoanCard:e},template:`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    `}),n=()=>({mixins:[d({loading:!0}),l()],components:{RecommendedLoanCard:e},template:`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    `});var i,r,a;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult
  }), cookieStoreStoryMixin()],
  components: {
    RecommendedLoanCard
  },
  template: \`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    \`
})`,...(a=(r=o.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};var t,s,m;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  components: {
    RecommendedLoanCard
  },
  template: \`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    \`
})`,...(m=(s=n.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};const Z=["Default","Loading"];export{o as Default,n as Loading,Z as __namedExportsOrder,W as default};
