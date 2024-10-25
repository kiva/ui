const __vite__fileDeps=["./entry-CreditSummaryLightbox-CxNyfXEFEW.js","./entry-index-CKVkeXup4D.js","./entry-tslib.es6-CxsSpKd0p8.js","./entry-mdi-BqhcKrkTVU.js","./entry-numeral-BEwyVwpTZh.js","./entry-_commonjsHelpers-BosuxZz1dT.js","./entry-KvLightbox-CQmar74Dk6.js","./entry-vue.esm-bundler-CCMUuEADRp.js","./entry-mdi-DelXZw8dIC.js","./entry-KvMaterialIcon-D8DnGkc65h.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js","./entry-KvLoadingPlaceholder-BggctNa6n7.js","./KvLoadingPlaceholder-DH6ZOmHx.css","./entry-KvTextLink-BkwoaonuUG.js","./CreditSummaryLightbox-DnPwtyGn.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{K as d}from"./entry-KvGrid-CI1zEoosXE.js";import{K as u}from"./entry-KvPageContainer-BzJOlwVIil.js";import{_ as ct}from"./iframe-C79d3aof.js";import{g as mt}from"./entry-index-CKVkeXup4D.js";import{n as D}from"./entry-numeral-BEwyVwpTZh.js";import{o as n,c as l,g as ut,n as pt,r as y,e,a as A,h as r,L as N,I as P,H as ft,f as w,w as L,Q as ht}from"./entry-vue.esm-bundler-CCMUuEADRp.js";import{g as yt}from"./entry-getCacheKey-BHImT0Oi8l.js";import{K as st}from"./entry-KvLoadingPlaceholder-BggctNa6n7.js";import{c as _t}from"./entry-observerUtils-DveHpw6JZJ.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as p}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as f}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"../sb-preview/runtime.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";const gt={data(){return{delayUntilVisibleObserver:null}},methods:{delayUntilVisible(t,i){const s=i??[this.$el];this.delayUntilVisibleObserver=_t({targets:s,callback:m=>{m.forEach(o=>{o.intersectionRatio>0&&t(o)})}}),this.delayUntilVisibleObserver||t()}},beforeUnmount(){this.delayUntilVisibleObserver&&this.delayUntilVisibleObserver.disconnect()}},nt={name:"AsyncPortfolioSection",mixins:[gt],emits:["visible"],props:{variant:{validator(t){return["default","minimal"].includes(t)},default:"default"}},computed:{variantDefault(){return this.variant==="default"},variantMinimal(){return this.variant==="minimal"}},mounted(){this.delayUntilVisible(t=>this.$emit("visible",t))}};function wt(t,i,s,m,o,a){return n(),l("section",{class:pt(["md:tw-mb-3 tw-px-2.5 tw-bg-primary md:tw-rounded md:tw-p-5",{"tw-py-8 tw-mb-0.5":a.variantDefault,"tw-py-3":a.variantMinimal}])},[ut(t.$slots,"default")],2)}const vt=M(nt,[["render",wt]]);nt.__docgenInfo={displayName:"AsyncPortfolioSection",exportName:"default",description:"",tags:{},props:[{name:"variant",type:{name:"string"},defaultValue:{func:!1,value:"'default'"},values:["default","minimal"]}],events:[{name:"visible",type:{names:["undefined"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/AsyncPortfolioSection.vue"]};const q=t=>D(t).format("$0,0[.]00a"),$=(t="")=>22+(t.length-2)*(16/6),it={name:"KivaEffectFigure",components:{KvLoadingPlaceholder:st},props:{depositAmount:{type:Number,default:0},lendAmount:{type:Number,default:0},loading:{type:Boolean,default:!1}},computed:{depositFormatted(){return q(this.depositAmount)},depositBasis(){return $(this.depositFormatted)},lendFormatted(){return q(this.lendAmount)},lendBasis(){return $(this.lendFormatted)}}},xt=e("figcaption",{class:"tw-text-base tw-mb-2"},[e("span",{class:"tw-sr-only"},"The Kiva effect:"),ft(" When your investment makes a greater impact due to the power of relending. ")],-1),St={class:"tw-flex tw-items-center tw-mx-auto tw-text-white",style:{"max-width":"24rem"}},bt={key:0,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"3"}},Kt={key:1,class:"tw-flex-auto tw-rounded-full tw-overflow-hidden",style:{"flex-grow":"5"}},kt=e("div",{class:"tw-bg-brand-900 tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1),Ct={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},At={class:"tw-text-h3",style:{"line-height":"1"}},Pt=e("span",{class:"tw-text-small",style:{"line-height":"1"}}," invested ",-1),Dt=e("div",{class:"tw-bg-brand tw-w-full tw-rounded-full",style:{"padding-bottom":"100%"}},null,-1),Mt={class:"tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center"},Vt={class:"tw-text-h3",style:{"line-height":"1"}},Nt=e("span",{class:"tw-text-small",style:{"line-height":"1"}}," of impact ",-1);function Lt(t,i,s,m,o,a){const g=y("kv-loading-placeholder");return n(),l("figure",null,[xt,e("div",St,[s.loading?(n(),l("div",bt,[A(g,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?(n(),l("div",Kt,[A(g,{style:{"padding-bottom":"100%"}})])):r("",!0),s.loading?r("",!0):(n(),l("div",{key:2,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.depositAmount}; flex-basis: ${a.depositBasis}%;`)},[kt,e("div",Ct,[e("span",At,P(a.depositFormatted),1),Pt])],4)),s.loading?r("",!0):(n(),l("div",{key:3,class:"tw-flex-auto tw-relative",style:N(`flex-grow: ${s.lendAmount}; flex-basis: ${a.lendBasis}%;`)},[Dt,e("div",Mt,[e("span",Vt,P(a.lendFormatted),1),Nt])],4))])])}const qt=M(it,[["render",Lt]]);it.__docgenInfo={displayName:"KivaEffectFigure",exportName:"default",description:"",tags:{},props:[{name:"depositAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"lendAmount",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"loading",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaEffectFigure.vue"]};const $t=ht(()=>ct(()=>import("./entry-CreditSummaryLightbox-CxNyfXEFEW.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]),import.meta.url)),at={name:"KivaCreditStats",serverCacheKey:()=>yt("KivaCreditStats"),inject:["apollo"],components:{AsyncPortfolioSection:vt,CreditSummaryLightbox:$t,KivaEffectFigure:qt,KvGrid:d,KvLoadingPlaceholder:st},data(){return{loading:!0,loadingPromise:null,depositAmount:25,lendAmount:1e3,showCreditSummary:!1}},methods:{fetchAsyncData(){this.loading&&!this.loadingPromise&&(this.loadingPromise=this.apollo.query({query:mt`query kivaCreditStats {
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
					}`}).then(({data:t})=>{var i,s,m,o;this.loading=!1,this.depositAmount=D(((s=(i=t==null?void 0:t.my)==null?void 0:i.lendingStats)==null?void 0:s.totalAmountDeposited)??0).value(),this.lendAmount=D(((o=(m=t==null?void 0:t.my)==null?void 0:m.userStats)==null?void 0:o.amount_of_loans)??0).value()}).finally(()=>{this.loadingPromise=null}))},whenVisible(){this.showCreditSummary=!0,this.fetchAsyncData()}}},Rt=e("h2",{class:"tw-mb-0.5"}," The Kiva effect ",-1),Ft={class:"tw-col-span-12 lg:tw-col-span-6"},Tt={class:"tw-col-span-12 lg:tw-col-span-6"},Ot={class:"tw-flex tw-flex-wrap tw-justify-between tw-items-center"},Bt=e("dt",{class:"tw-text-h4"}," Total deposits ",-1),Et={key:1,class:"tw-text-action tw-text-h4"},It=e("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've deposited into your Kiva account. ",-1),Ut=e("dt",{class:"tw-text-h4"}," Total amount lent ",-1),Gt={key:3,class:"tw-text-brand tw-text-h4"},Wt=e("dd",{class:"tw-basis-full tw-text-secondary tw-text-small tw-mt-0.5 tw-mb-3 tw-pr-8"}," The total amount of funds you've lent to borrowers. This includes loans made using repaid Kiva credit. ",-1);function jt(t,i,s,m,o,a){const g=y("kiva-effect-figure"),V=y("kv-loading-placeholder"),rt=y("credit-summary-lightbox"),lt=y("kv-grid"),dt=y("async-portfolio-section");return n(),w(dt,{onVisible:a.whenVisible,"data-testid":"credit-stats"},{default:L(()=>[Rt,A(lt,{class:"tw-grid-cols-12"},{default:L(()=>[e("div",Ft,[A(g,{"deposit-amount":o.depositAmount,"lend-amount":o.lendAmount,loading:o.loading},null,8,["deposit-amount","lend-amount","loading"])]),e("div",Tt,[e("dl",Ot,[Bt,o.loading?(n(),w(V,{key:0,style:{width:"40px",height:"16px"}})):r("",!0),o.loading?r("",!0):(n(),l("dd",Et,P(t.$filters.numeral(o.depositAmount,"$0,0.00")),1)),It,Ut,o.loading?(n(),w(V,{key:2,style:{width:"56px",height:"16px"}})):r("",!0),o.loading?r("",!0):(n(),l("dd",Gt,P(t.$filters.numeral(o.lendAmount,"$0,0.00")),1)),Wt]),o.showCreditSummary?(n(),w(rt,{key:0})):r("",!0)])],void 0,!0),_:1})],void 0),_:1},8,["onVisible"])}const c=M(at,[["render",jt]]);at.__docgenInfo={displayName:"KivaCreditStats",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/pages/Portfolio/ImpactDashboard/KivaCreditStats.vue"]};const _=(t,i)=>({data:{my:{userStats:{amount_of_loans:t},lendingStats:{id:1234,totalAmountDeposited:i}}}}),h=`
    <kv-page-container class="tw-bg-secondary">
        <kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
            <div class="tw-col-span-12 md:tw-col-span-9 tw-pt-3">
                <kiva-credit-stats />
            </div>
        </kv-grid>
    </kv-page-container>
`,le={title:"Page/Portfolio/Kiva Credit Stats",component:c},v=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({loading:!0}),f()],template:h}),x=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("25.00","25.00")}),f()],template:h}),S=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("0.00","0.00")}),f()],template:h}),b=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("50.00","0.00")}),f()],template:h}),K=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("0.00","75.00")}),f()],template:h}),k=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("856235.57","2346.67")}),f()],template:h}),C=()=>({components:{KivaCreditStats:c,KvGrid:d,KvPageContainer:u},mixins:[p({queryResult:_("8662.00","35752.45")}),f()],template:h});var R,F,T;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  template
})`,...(T=(F=v.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var O,B,E;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('25.00', '25.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(E=(B=x.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var I,U,G;S.parameters={...S.parameters,docs:{...(I=S.parameters)==null?void 0:I.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('0.00', '0.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(G=(U=S.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var W,j,z;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('50.00', '0.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(z=(j=b.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var H,Q,J;K.parameters={...K.parameters,docs:{...(H=K.parameters)==null?void 0:H.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('0.00', '75.00')
  }), cookieStoreStoryMixin()],
  template
})`,...(J=(Q=K.parameters)==null?void 0:Q.docs)==null?void 0:J.source}}};var X,Y,Z;k.parameters={...k.parameters,docs:{...(X=k.parameters)==null?void 0:X.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('856235.57', '2346.67')
  }), cookieStoreStoryMixin()],
  template
})`,...(Z=(Y=k.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var tt,et,ot;C.parameters={...C.parameters,docs:{...(tt=C.parameters)==null?void 0:tt.docs,source:{originalSource:`() => ({
  components: {
    KivaCreditStats,
    KvGrid,
    KvPageContainer
  },
  mixins: [apolloStoryMixin({
    queryResult: data('8662.00', '35752.45')
  }), cookieStoreStoryMixin()],
  template
})`,...(ot=(et=C.parameters)==null?void 0:et.docs)==null?void 0:ot.source}}};const de=["Loading","OneLoanOneDeposit","NoLoansNoDeposits","LoansWithNoDeposits","DepositsWithNoLoans","MoreLoansThanDeposits","MoreDepositsThanLoans"];export{K as DepositsWithNoLoans,v as Loading,b as LoansWithNoDeposits,C as MoreDepositsThanLoans,k as MoreLoansThanDeposits,S as NoLoansNoDeposits,x as OneLoanOneDeposit,de as __namedExportsOrder,le as default};
