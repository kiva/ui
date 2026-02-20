const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./entry-CreditSummaryLightbox-DCX4nSTHb8.js","./entry-index-CWclSTHHJk.js","./entry-mdi-B1ONwcTkQ2.js","./entry-numeral-xVHG5DEP0A.js","./entry-_commonjsHelpers-Cpj98o6Yn6.js","./entry-vue.esm-bundler-C0PPCo9W96.js","./entry-KvLoadingPlaceholder-B_9_tltQhY.js","./entry-KvWwwHeader-C1bm1YMh4q.js","./KvWwwHeader-DtWMcmZI.css","./entry-KvLightbox-y8nxBJS-RZ.js","./entry-KvMaterialIcon-C3KLX5OV-L.js","./entry-KvTextLink-DIVE-Pebb8.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js","./CreditSummaryLightbox-CvDRgkVt.css"])))=>i.map(i=>d[i]);
import{c as l,v as mt,A as ut,o as i,q as o,M as ct,m as r,a as P,G as N,L as A,r as g,O as pt,z as h,C as L}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import{w as d}from"./entry-KvGrid-Cgm16aFdnL.js";import{n as D}from"./entry-numeral-xVHG5DEP0A.js";import{u as c}from"./entry-KvPageContainer-Dh8GJwjiow.js";import{_ as ft}from"./iframe-Cc_r_Bkf.js";import{g as vt}from"./entry-index-CWclSTHHJk.js";import{g as gt}from"./entry-getCacheKey-CFbvtT9xx4.js";import{_ as nt}from"./entry-KvLoadingPlaceholder-B_9_tltQhY.js";import{c as yt}from"./entry-observerUtils-DveHpw6JZJ.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as f}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const wt={data(){return{delayUntilVisibleObserver:null}},methods:{delayUntilVisible(e,t){const s=t??[this.$el];this.delayUntilVisibleObserver=yt({targets:s,callback:u=>{u.forEach(n=>{n.intersectionRatio>0&&e(n)})}}),this.delayUntilVisibleObserver||e()}},beforeUnmount(){this.delayUntilVisibleObserver&&this.delayUntilVisibleObserver.disconnect()}},st={name:"AsyncPortfolioSection",mixins:[wt],emits:["visible"],props:{variant:{validator(e){return["default","minimal"].includes(e)},default:"default"}},computed:{variantDefault(){return this.variant==="default"},variantMinimal(){return this.variant==="minimal"}},mounted(){this.delayUntilVisible(e=>this.$emit("visible",e))}};function ht(e,t,s,u,n,a){return i(),l("section",{class:ut(["md:tw-mb-3 tw-px-2.5 tw-bg-primary md:tw-rounded md:tw-p-5",{"tw-py-8 tw-mb-0.5":a.variantDefault,"tw-py-3":a.variantMinimal}])},[mt(e.$slots,"default")],2)}const xt=M(st,[["render",ht]]);st.__docgenInfo={displayName:"AsyncPortfolioSection",exportName:"default",description:"",tags:{},props:[{name:"variant",type:{name:"string"},defaultValue:{func:!1,value:"'default'"},values:["default","minimal"]}],events:[{name:"visible",type:{names:["undefined"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/AsyncPortfolioSection.vue"]};const q=e=>D(e).format("$0,0[.]00a"),G=(e="")=>22+(e.length-2)*(16/6),it={name:"KivaEffectFigure",components:{KvLoadingPlaceholder:nt},props:{depositAmount:{type:Number,default:0},lendAmount:{type:Number,default:0},loading:{type:Boolean,default:!1}},computed:{depositFormatted(){return q(this.depositAmount)},depositBasis(){return G(this.depositFormatted)},lendFormatted(){return q(this.lendAmount)},lendBasis(){return G(this.lendFormatted)}}},_t={class:"tw-flex tw-items-center tw-mx-auto tw-text-white",style:{"max-width":"24rem"}},St={key:0,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"3"}},bt={key:1,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"5"}},Kt={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},Ct={class:"tw-text-h3",style:{"line-height":"1"}},kt={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},Pt={class:"tw-text-h3",style:{"line-height":"1"}};function At(e,t,s,u,n,a){const w=g("kv-loading-placeholder");return i(),l("figure",null,[t[4]||(t[4]=o("figcaption",{class:"tw-text-base tw-mb-2"},[o("span",{class:"tw-sr-only"},"The Kiva effect:"),ct(" When your investment makes a greater impact due to the power of relending. ")],-1)),o("div",_t,[s.loading?(i(),l("div",St,[P(w,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?(i(),l("div",bt,[P(w,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?r("",!0):(i(),l("div",{key:2,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.depositAmount}; flex-basis: ${a.depositBasis}%;`)},[t[1]||(t[1]=o("div",{class:"tw-bg-brand-900 tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1)),o("div",Kt,[o("span",Ct,A(a.depositFormatted),1),t[0]||(t[0]=o("span",{class:"tw-text-small",style:{"line-height":"1"}}," invested ",-1))])],4)),s.loading?r("",!0):(i(),l("div",{key:3,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.lendAmount}; flex-basis: ${a.lendBasis}%;`)},[t[3]||(t[3]=o("div",{class:"tw-bg-brand tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1)),o("div",kt,[o("span",Pt,A(a.lendFormatted),1),t[2]||(t[2]=o("span",{class:"tw-text-small",style:{"line-height":"1"}}," of impact ",-1))])],4))])])}const Dt=M(it,[["render",At]]);it.__docgenInfo={displayName:"KivaEffectFigure",exportName:"default",description:"",tags:{},props:[{name:"depositAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"lendAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"loading",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaEffectFigure.vue"]};const Mt=pt(()=>ft(()=>import("./entry-CreditSummaryLightbox-DCX4nSTHb8.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]),import.meta.url)),at={name:"KivaCreditStats",serverCacheKey:()=>gt("KivaCreditStats"),inject:["apollo"],components:{AsyncPortfolioSection:xt,CreditSummaryLightbox:Mt,KivaEffectFigure:Dt,KvGrid:d,KvLoadingPlaceholder:nt},data(){return{loading:!0,loadingPromise:null,depositAmount:25,lendAmount:1e3,showCreditSummary:!1}},methods:{fetchAsyncData(){this.loading&&!this.loadingPromise&&(this.loadingPromise=this.apollo.query({query:vt`query kivaCreditStats {
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
					}`}).then(({data:e})=>{var t,s,u,n;this.loading=!1,this.depositAmount=D(((s=(t=e==null?void 0:e.my)==null?void 0:t.lendingStats)==null?void 0:s.totalAmountDeposited)??0).value(),this.lendAmount=D(((n=(u=e==null?void 0:e.my)==null?void 0:u.userStats)==null?void 0:n.amount_of_loans)??0).value()}).finally(()=>{this.loadingPromise=null}))},whenVisible(){this.showCreditSummary=!0,this.fetchAsyncData()}}},Vt={class:"tw-col-span-12 lg:tw-col-span-6"},Nt={class:"tw-col-span-12 lg:tw-col-span-6"},Lt={class:"tw-flex tw-flex-wrap tw-justify-between tw-items-center"},qt={key:1,class:"tw-text-action tw-text-h4"},Gt={key:3,class:"tw-text-brand tw-text-h4"};function Rt(e,t,s,u,n,a){const w=g("kiva-effect-figure"),V=g("kv-loading-placeholder"),rt=g("credit-summary-lightbox"),lt=g("kv-grid"),dt=g("async-portfolio-section");return i(),h(dt,{onVisible:a.whenVisible,"data-testid":"credit-stats"},{default:L(()=>[t[4]||(t[4]=o("h2",{class:"tw-mb-0.5"}," The Kiva effect ",-1)),P(lt,{class:"tw-grid-cols-12"},{default:L(()=>[o("div",Vt,[P(w,{"deposit-amount":n.depositAmount,"lend-amount":n.lendAmount,loading:n.loading},null,8,["deposit-amount","lend-amount","loading"])]),o("div",Nt,[o("dl",Lt,[t[0]||(t[0]=o("dt",{class:"tw-text-h4"}," Total deposits ",-1)),n.loading?(i(),h(V,{key:0,style:{width:"40px",height:"16px"}})):r("",!0),n.loading?r("",!0):(i(),l("dd",qt,A(e.$filters.numeral(n.depositAmount,"$0,0.00")),1)),t[1]||(t[1]=o("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've deposited into your Kiva account. ",-1)),t[2]||(t[2]=o("dt",{class:"tw-text-h4"}," Total amount lent ",-1)),n.loading?(i(),h(V,{key:2,style:{width:"56px",height:"16px"}})):r("",!0),n.loading?r("",!0):(i(),l("dd",Gt,A(e.$filters.numeral(n.lendAmount,"$0,0.00")),1)),t[3]||(t[3]=o("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've lent to borrowers. This includes loans made using repaid Kiva credit. ",-1))]),n.showCreditSummary?(i(),h(rt,{key:0})):r("",!0)])],void 0,!0),_:1})],void 0),_:1,__:[4]},8,["onVisible"])}const m=M(at,[["render",Rt]]);at.__docgenInfo={displayName:"KivaCreditStats",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaCreditStats.vue"]};const y=(e,t)=>({data:{my:{userStats:{amount_of_loans:e},lendingStats:{id:1234,totalAmountDeposited:t}}}}),v=`
    <kv-page-container class="tw-bg-secondary">
        <kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
            <div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
                <kiva-credit-stats />
            </div>
        </kv-grid>
    </kv-page-container>
`,Xt={title:"Page/Portfolio/Kiva Credit Stats",component:m},x=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({loading:!0}),f()],template:v}),_=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("25.00","25.00")}),f()],template:v}),S=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("0.00","0.00")}),f()],template:v}),b=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("50.00","0.00")}),f()],template:v}),K=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("0.00","75.00")}),f()],template:v}),C=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("856235.57","2346.67")}),f()],template:v}),k=()=>({components:{KivaCreditStats:m,KvGrid:d,KvPageContainer:c},mixins:[p({queryResult:y("8662.00","35752.45")}),f()],template:v});var R,F,O;x.parameters={...x.parameters,docs:{...(R=x.parameters)==null?void 0:R.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  template
})`,...(O=(F=x.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var T,B,$;_.parameters={..._.parameters,docs:{...(T=_.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('25.00', '25.00')
  }), cookieStoreStoryMixin()],
  template
})`,...($=(B=_.parameters)==null?void 0:B.docs)==null?void 0:$.source}}};var E,U,I;S.parameters={...S.parameters,docs:{...(E=S.parameters)==null?void 0:E.docs,source:{originalSource:`() => ({
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
})`,...(z=(j=b.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var H,J,Q;K.parameters={...K.parameters,docs:{...(H=K.parameters)==null?void 0:H.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('0.00', '75.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(Q=(J=K.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var X,Y,Z;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('856235.57', '2346.67')
  }), cookieStoreStoryMixin()],
  template
})`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var tt,et,ot;k.parameters={...k.parameters,docs:{...(tt=k.parameters)==null?void 0:tt.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('8662.00', '35752.45')
  }), cookieStoreStoryMixin()],
  template
})`,...(ot=(et=k.parameters)==null?void 0:et.docs)==null?void 0:ot.source}}};const Yt=["Loading","OneLoanOneDeposit","NoLoansNoDeposits","LoansWithNoDeposits","DepositsWithNoLoans","MoreLoansThanDeposits","MoreDepositsThanLoans"];export{K as DepositsWithNoLoans,x as Loading,b as LoansWithNoDeposits,k as MoreDepositsThanLoans,C as MoreLoansThanDeposits,S as NoLoansNoDeposits,_ as OneLoanOneDeposit,Yt as __namedExportsOrder,Xt as default};
