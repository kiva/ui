const __vite__fileDeps=["./entry-CreditSummaryLightbox-B2mI86rfvs.js","./entry-index-CKVkeXup4D.js","./entry-tslib.es6-CxsSpKd0p8.js","./entry-KvMaterialIcon-Dgz8mJKr4K.js","./entry-vue.esm-bundler-CTwdbZZHjD.js","./entry-KvWideLoanCard-CfbcqIxttL.js","./entry-_commonjsHelpers-BosuxZz1dT.js","./KvWideLoanCard-Cw9j0xcv.css","./entry-numeral-BEwyVwpTZh.js","./entry-KvLoadingPlaceholder-D3FOqFpIEE.js","./entry-KvLightbox-MGX0YSi3hl.js","./entry-KvTextLink-CA8TK3MPKG.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js","./CreditSummaryLightbox-BeK-WudA.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{o as n,c as l,g as ce,n as me,r as h,e as t,a as P,h as r,v as N,F as A,E as ue,f as _,w as L,Q as pe}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvWideLoanCard-CfbcqIxttL.js";import{n as D}from"./entry-numeral-BEwyVwpTZh.js";import{g as d}from"./entry-KvGrid-Orp7tVizFZ.js";import{x as u}from"./entry-KvPageContainer-B0drOrCGYW.js";import{_ as fe}from"./iframe-Bg28yleE.js";import{g as ve}from"./entry-index-CKVkeXup4D.js";import{g as he}from"./entry-getCacheKey-CAKWfa50vI.js";import{_ as se}from"./entry-KvLoadingPlaceholder-D3FOqFpIEE.js";import{c as ge}from"./entry-observerUtils-DveHpw6JZJ.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as f}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"../sb-preview/runtime.js";import"./entry-tslib.es6-CxsSpKd0p8.js";const ye={data(){return{delayUntilVisibleObserver:null}},methods:{delayUntilVisible(e,i){const s=i??[this.$el];this.delayUntilVisibleObserver=ge({targets:s,callback:m=>{m.forEach(o=>{o.intersectionRatio>0&&e(o)})}}),this.delayUntilVisibleObserver||e()}},beforeUnmount(){this.delayUntilVisibleObserver&&this.delayUntilVisibleObserver.disconnect()}},ne={name:"AsyncPortfolioSection",mixins:[ye],emits:["visible"],props:{variant:{validator(e){return["default","minimal"].includes(e)},default:"default"}},computed:{variantDefault(){return this.variant==="default"},variantMinimal(){return this.variant==="minimal"}},mounted(){this.delayUntilVisible(e=>this.$emit("visible",e))}};function _e(e,i,s,m,o,a){return n(),l("section",{class:me(["md:tw-mb-3 tw-px-2.5 tw-bg-primary md:tw-rounded md:tw-p-5",{"tw-py-8 tw-mb-0.5":a.variantDefault,"tw-py-3":a.variantMinimal}])},[ce(e.$slots,"default")],2)}const we=M(ne,[["render",_e]]);ne.__docgenInfo={displayName:"AsyncPortfolioSection",exportName:"default",description:"",tags:{},props:[{name:"variant",type:{name:"string"},defaultValue:{func:!1,value:"'default'"},values:["default","minimal"]}],events:[{name:"visible",type:{names:["undefined"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/AsyncPortfolioSection.vue"]};const q=e=>D(e).format("$0,0[.]00a"),G=(e="")=>22+(e.length-2)*(16/6),ie={name:"KivaEffectFigure",components:{KvLoadingPlaceholder:se},props:{depositAmount:{type:Number,default:0},lendAmount:{type:Number,default:0},loading:{type:Boolean,default:!1}},computed:{depositFormatted(){return q(this.depositAmount)},depositBasis(){return G(this.depositFormatted)},lendFormatted(){return q(this.lendAmount)},lendBasis(){return G(this.lendFormatted)}}},xe=t("figcaption",{class:"tw-text-base tw-mb-2"},[t("span",{class:"tw-sr-only"},"The Kiva effect:"),ue(" When your investment makes a greater impact due to the power of relending. ")],-1),Se={class:"tw-flex tw-items-center tw-mx-auto tw-text-white",style:{"max-width":"24rem"}},be={key:0,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"3"}},Ke={key:1,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"5"}},Ce=t("div",{class:"tw-bg-brand-900 tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1),ke={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},Pe={class:"tw-text-h3",style:{"line-height":"1"}},Ae=t("span",{class:"tw-text-small",style:{"line-height":"1"}}," invested ",-1),De=t("div",{class:"tw-bg-brand tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1),Me={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},Ve={class:"tw-text-h3",style:{"line-height":"1"}},Ne=t("span",{class:"tw-text-small",style:{"line-height":"1"}}," of impact ",-1);function Le(e,i,s,m,o,a){const y=h("kv-loading-placeholder");return n(),l("figure",null,[xe,t("div",Se,[s.loading?(n(),l("div",be,[P(y,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?(n(),l("div",Ke,[P(y,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?r("",!0):(n(),l("div",{key:2,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.depositAmount}; flex-basis: ${a.depositBasis}%;`)},[Ce,t("div",ke,[t("span",Pe,A(a.depositFormatted),1),Ae])],4)),s.loading?r("",!0):(n(),l("div",{key:3,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.lendAmount}; flex-basis: ${a.lendBasis}%;`)},[De,t("div",Me,[t("span",Ve,A(a.lendFormatted),1),Ne])],4))])])}const qe=M(ie,[["render",Le]]);ie.__docgenInfo={displayName:"KivaEffectFigure",exportName:"default",description:"",tags:{},props:[{name:"depositAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"lendAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"loading",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaEffectFigure.vue"]};const Ge=pe(()=>fe(()=>import("./entry-CreditSummaryLightbox-B2mI86rfvs.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]),import.meta.url)),ae={name:"KivaCreditStats",serverCacheKey:()=>he("KivaCreditStats"),inject:["apollo"],components:{AsyncPortfolioSection:we,CreditSummaryLightbox:Ge,KivaEffectFigure:qe,KvGrid:d,KvLoadingPlaceholder:se},data(){return{loading:!0,loadingPromise:null,depositAmount:25,lendAmount:1e3,showCreditSummary:!1}},methods:{fetchAsyncData(){this.loading&&!this.loadingPromise&&(this.loadingPromise=this.apollo.query({query:ve`query kivaCreditStats {
						my {
							id
							lendingStats {
								id
								totalAmountDeposited
							}
							userStats {
								amount_of_loans
							}
						}
					}`}).then(({data:e})=>{var i,s,m,o;this.loading=!1,this.depositAmount=D(((s=(i=e==null?void 0:e.my)==null?void 0:i.lendingStats)==null?void 0:s.totalAmountDeposited)??0).value(),this.lendAmount=D(((o=(m=e==null?void 0:e.my)==null?void 0:m.userStats)==null?void 0:o.amount_of_loans)??0).value()}).finally(()=>{this.loadingPromise=null}))},whenVisible(){this.showCreditSummary=!0,this.fetchAsyncData()}}},$e=t("h2",{class:"tw-mb-0.5"}," The Kiva effect ",-1),Fe={class:"tw-col-span-12 lg:tw-col-span-6"},Re={class:"tw-col-span-12 lg:tw-col-span-6"},Te={class:"tw-flex tw-flex-wrap tw-justify-between tw-items-center"},Oe=t("dt",{class:"tw-text-h4"}," Total deposits ",-1),Be={key:1,class:"tw-text-action tw-text-h4"},Ee=t("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've deposited into your Kiva account. ",-1),Ue=t("dt",{class:"tw-text-h4"}," Total amount lent ",-1),Ie={key:3,class:"tw-text-brand tw-text-h4"},We=t("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've lent to borrowers. This includes loans made using repaid Kiva credit. ",-1);function je(e,i,s,m,o,a){const y=h("kiva-effect-figure"),V=h("kv-loading-placeholder"),re=h("credit-summary-lightbox"),le=h("kv-grid"),de=h("async-portfolio-section");return n(),_(de,{onVisible:a.whenVisible,"data-testid":"credit-stats"},{default:L(()=>[$e,P(le,{class:"tw-grid-cols-12"},{default:L(()=>[t("div",Fe,[P(y,{"deposit-amount":o.depositAmount,"lend-amount":o.lendAmount,loading:o.loading},null,8,["deposit-amount","lend-amount","loading"])]),t("div",Re,[t("dl",Te,[Oe,o.loading?(n(),_(V,{key:0,style:{width:"40px",height:"16px"}})):r("",!0),o.loading?r("",!0):(n(),l("dd",Be,A(e.$filters.numeral(o.depositAmount,"$0,0.00")),1)),Ee,Ue,o.loading?(n(),_(V,{key:2,style:{width:"56px",height:"16px"}})):r("",!0),o.loading?r("",!0):(n(),l("dd",Ie,A(e.$filters.numeral(o.lendAmount,"$0,0.00")),1)),We]),o.showCreditSummary?(n(),_(re,{key:0})):r("",!0)])],void 0,!0),_:1})],void 0),_:1},8,["onVisible"])}const c=M(ae,[["render",je]]);ae.__docgenInfo={displayName:"KivaCreditStats",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaCreditStats.vue"]};const g=(e,i)=>({data:{my:{userStats:{amount_of_loans:e},lendingStats:{id:1234,totalAmountDeposited:i}}}}),v=`
    <kv-page-container class="tw-bg-secondary">
        <kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
            <div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
                <kiva-credit-stats />
            </div>
        </kv-grid>
    </kv-page-container>
`,dt={title:"Page/Portfolio/Kiva Credit Stats",component:c},w=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({loading:!0}),f()],template:v}),x=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("25.00","25.00")}),f()],template:v}),S=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("0.00","0.00")}),f()],template:v}),b=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("50.00","0.00")}),f()],template:v}),K=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("0.00","75.00")}),f()],template:v}),C=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("856235.57","2346.67")}),f()],template:v}),k=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:g("8662.00","35752.45")}),f()],template:v});var $,F,R;w.parameters={...w.parameters,docs:{...($=w.parameters)==null?void 0:$.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  template
})`,...(R=(F=w.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var T,O,B;x.parameters={...x.parameters,docs:{...(T=x.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('25.00', '25.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(B=(O=x.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var E,U,I;S.parameters={...S.parameters,docs:{...(E=S.parameters)==null?void 0:E.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('0.00', '0.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(I=(U=S.parameters)==null?void 0:U.docs)==null?void 0:I.source}}};var W,j,z;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('50.00', '0.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(z=(j=b.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var Q,H,J;K.parameters={...K.parameters,docs:{...(Q=K.parameters)==null?void 0:Q.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('0.00', '75.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(J=(H=K.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var X,Y,Z;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('856235.57', '2346.67')
  }), cookieStoreStoryMixin()],
  template
})`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,oe;k.parameters={...k.parameters,docs:{...(ee=k.parameters)==null?void 0:ee.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('8662.00', '35752.45')
  }), cookieStoreStoryMixin()],
  template
})`,...(oe=(te=k.parameters)==null?void 0:te.docs)==null?void 0:oe.source}}};const ct=["Loading","OneLoanOneDeposit","NoLoansNoDeposits","LoansWithNoDeposits","DepositsWithNoLoans","MoreLoansThanDeposits","MoreDepositsThanLoans"];export{K as DepositsWithNoLoans,w as Loading,b as LoansWithNoDeposits,k as MoreDepositsThanLoans,C as MoreLoansThanDeposits,S as NoLoansNoDeposits,x as OneLoanOneDeposit,ct as __namedExportsOrder,dt as default};
