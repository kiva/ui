const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./entry-GoalInReviewSlide1-CZg9C2bH1V.js","./entry-vue.esm-bundler-B52OYB4W0G.js","./entry-numeral-xVHG5DEP0A.js","./entry-_commonjsHelpers-Cpj98o6Yn6.js","./entry-KvWwwHeaderBasic-DOcfaa650D.js","./entry-index-CWclSTHHJk.js","./entry-tailwind.config-DbyGLZVW5i.js","./entry-index-CovN8vffBz.js","./entry-index-DaZG7dZWP2.js","./entry-index-jQMUY8qRYX.js","./iframe-BW8Ws25b.js","./KvWwwHeaderBasic-DfEpHwSx.css","./entry-stringParserUtils-ltRuUwZbQA.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js","./GoalInReviewSlide1-CE8eCBQ_.css","./entry-GoalInReviewSlide2-Dxu_PVvz_K.js","./entry-GoalInReviewSlidePlaceholder-DKDAApYC2D.js","./entry-GoalInReviewSlide3-4ygBXLAgki.js","./entry-GoalInReviewSlide4-C2gcSK8EWt.js","./entry-useBadgeData-_afH1sGXpR.js","./entry-logReadQueryError-Codcl0QZ_g.js","./entry-logFormatter-DhjghUk5Me.js","./entry-achievementUtils-D1klFtLQZL.js","./entry-imageUtils-BO57SRLi2g.js","./entry-contentfulUtils-BSVc25-f1Y.js","./entry-index-7WUD3idviV.js","./entry-dateUtils-BxsQnD_ajA.js","./entry-index-BMPNuZbV7y.js","./entry-index-6TolKbZ2-J.js","./entry-index-tAHLmhMYuW.js","./entry-GoalInReviewSlide5-Df0Zn_sMdV.js","./entry-GoalInReviewSlide6-AHK3L8VXF_.js","./entry-GoalInReviewSlide7-jHJKpEuk_-.js"])))=>i.map(i=>d[i]);
import{f as ae,e as T,u as t,k as oe,o as re,a as A,d as a,t as le,P as o,z as se}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{_ as r}from"./iframe-BW8Ws25b.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{M as ne}from"./entry-KvLightbox-DepMJA2Aa3.js";import"./entry-numeral-xVHG5DEP0A.js";import{b as ie}from"./entry-goalInReviewSampleData-eFE1ut3bCa.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-printing-BcRIHVBU-U.js";const me={class:"tw-sr-only"},ce={class:"tw-bg-secondary"},g={__name:"GoalInReviewModal",props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},emits:["close"],setup(e,{emit:i}){const v=o(()=>r(()=>import("./entry-GoalInReviewSlide1-CZg9C2bH1V.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]),import.meta.url)),w=o(()=>r(()=>import("./entry-GoalInReviewSlide2-Dxu_PVvz_K.js"),__vite__mapDeps([15,1,16]),import.meta.url)),s=o(()=>r(()=>import("./entry-GoalInReviewSlide3-4ygBXLAgki.js"),__vite__mapDeps([17,1,16]),import.meta.url)),y=o(()=>r(()=>import("./entry-GoalInReviewSlide4-C2gcSK8EWt.js"),__vite__mapDeps([18,1,19,20,21,22,23,24,25,6,3,26,9,7,27,12,28,29]),import.meta.url)),f=o(()=>r(()=>import("./entry-GoalInReviewSlide5-Df0Zn_sMdV.js"),__vite__mapDeps([30,1,16]),import.meta.url)),X=o(()=>r(()=>import("./entry-GoalInReviewSlide6-AHK3L8VXF_.js"),__vite__mapDeps([31,1,16]),import.meta.url)),Y=o(()=>r(()=>import("./entry-GoalInReviewSlide7-jHJKpEuk_-.js"),__vite__mapDeps([32,1,16]),import.meta.url)),Z=i,ee=oe("$kvTrackEvent",()=>{}),te=()=>{ee("portfolio","click","goal-in-review-close"),Z("close")};return(de,ue)=>(re(),ae(t(ne),{class:"goal-in-review-modal tw-p-14 max-md:tw-flex max-md:tw-items-end max-md:tw-overflow-y-hidden max-md:tw-p-0",visible:e.show,title:"",onLightboxClosed:te},{header:T(()=>{var n;return[A("h2",me,le((n=e.data)==null?void 0:n.year)+" goal in review ",1)]}),default:T(()=>{var n,h,S,b,I,_,R,M,G,D,E,x,L,P,k,C,O,V,N;return[A("div",ce,[a(t(v),{"goal-status":(h=(n=e.data)==null?void 0:n.goalSummary)==null?void 0:h.status,"first-name":(S=e.data)==null?void 0:S.firstName,year:(b=e.data)==null?void 0:b.year,"amount-lent":(_=(I=e.data)==null?void 0:I.loanStats)==null?void 0:_.totalLent,"borrower-count":(M=(R=e.data)==null?void 0:R.loanStats)==null?void 0:M.borrowers,category:(D=(G=e.data)==null?void 0:G.goalSummary)==null?void 0:D.category,"percent-complete":(x=(E=e.data)==null?void 0:E.loanStats)==null?void 0:x.percentComplete},null,8,["goal-status","first-name","year","amount-lent","borrower-count","category","percent-complete"]),a(t(w),{"loan-stats":(L=e.data)==null?void 0:L.loanStats},null,8,["loan-stats"]),a(t(s),{"borrower-list":(P=e.data)==null?void 0:P.borrowerList},null,8,["borrower-list"]),a(t(y),{"goal-summary":(k=e.data)==null?void 0:k.goalSummary,"lifetime-percentile":(C=e.data)==null?void 0:C.lifetimePercentile},null,8,["goal-summary","lifetime-percentile"]),a(t(f),{sectors:(O=e.data)==null?void 0:O.sectors},null,8,["sectors"]),a(t(X),{"goal-insights":(V=e.data)==null?void 0:V.goalInsights},null,8,["goal-insights"]),a(t(Y),{"wrap-up":(N=e.data)==null?void 0:N.wrapUp},null,8,["wrap-up"])])]},void 0),_:1},8,["visible"]))}};g.__docgenInfo={exportName:"default",displayName:"GoalInReviewModal",description:"",tags:{},props:[{name:"show",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"data",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],events:[{name:"close"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/GoalInReview/GoalInReviewModal.vue"]};const Ge={title:"MyKiva/GoalInReview/GoalInReviewModal",component:g,parameters:{layout:"fullscreen"}},p=(e={})=>{const i=(v,{argTypes:w})=>({props:Object.keys(w),components:{GoalInReviewModal:g},setup(){const s=se(e.show);return{args:e,closeModal:()=>{s.value=!1},openModal:()=>{s.value=!0},showModal:s}},template:`
            <div class="tw-min-h-screen tw-bg-stone-1 tw-p-4">
                <h1 class="tw-text-title tw-mb-3">Sample MyKiva page content</h1>
                <div class="tw-h-20 tw-rounded tw-bg-eco-green-3 tw-mb-3"></div>
                <div class="tw-h-32 tw-rounded tw-bg-white"></div>
                <button class="tw-mt-3 tw-rounded tw-bg-brand tw-px-2 tw-py-1 tw-text-white" @click="openModal">
                    Open recap
                </button>
                <GoalInReviewModal :show="showModal" :data="args.data" @close="closeModal" />
            </div>
        `});return i.args=e,i},l=ie(2026),m=p({show:!0,data:l}),c=p({show:!0,data:{...l,goalSummary:{...l.goalSummary,status:"in-progress"},loanStats:{totalLent:50,borrowers:1,percentComplete:35}}}),d=p({show:!0,data:{...l,firstName:""}}),u=p({show:!0,data:{...l,goalSummary:{...l.goalSummary,category:""},loanStats:{totalLent:null,borrowers:null,percentComplete:null}}});var j,B,K;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`story({
  show: true,
  data: completeData
})`,...(K=(B=m.parameters)==null?void 0:B.docs)==null?void 0:K.source}}};var W,$,z;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`story({
  show: true,
  data: {
    ...completeData,
    goalSummary: {
      ...completeData.goalSummary,
      status: 'in-progress'
    },
    loanStats: {
      totalLent: 50,
      borrowers: 1,
      percentComplete: 35
    }
  }
})`,...(z=($=c.parameters)==null?void 0:$.docs)==null?void 0:z.source}}};var F,U,q;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  show: true,
  data: {
    ...completeData,
    firstName: ''
  }
})`,...(q=(U=d.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var H,J,Q;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`story({
  show: true,
  data: {
    ...completeData,
    goalSummary: {
      ...completeData.goalSummary,
      category: ''
    },
    loanStats: {
      totalLent: null,
      borrowers: null,
      percentComplete: null
    }
  }
})`,...(Q=(J=u.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};const De=["Default","GoalInProgress","CompleteWithoutName","MissingStats"];export{d as CompleteWithoutName,m as Default,c as GoalInProgress,u as MissingStats,De as __namedExportsOrder,Ge as default};
