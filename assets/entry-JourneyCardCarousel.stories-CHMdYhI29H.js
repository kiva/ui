import{_ as b,w as v,j as A}from"./entry-my-kiva-slides-mock-BZ71gPAz6j.js";import{c as T}from"./entry-badge-journey-data-mock-CA_V6NnPCv.js";import"./entry-vue.esm-bundler-DjLyFRslqj.js";import"./entry-useBreakpoints-DmfndXnILT.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-achievementUtils-4YR0vuRrR2.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-contentfulUtils-BYNyFhm6CJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-useBadgeData-DV1-MrltJl.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-KvWwwHeaderBasic-C_kuFZZQmp.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-index-ykU41f_qhj.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-agQorjtY.js";import"./entry-KvCarousel-WZ4hOssU6E.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-MyKivaCard-TOtvg-pefR.js";import"./entry-NextYearGoalCard-yOdF2DzBXy.js";import"./entry-useGoalData-C8JmTMUqoc.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-goalCopy-jhaVZ1HBO_.js";import"./entry-vue-router-D4k6g03Mt4.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-CojvDnV-NW.js";import"./entry-KvProgressCircle-Cm0r15F9k1.js";import"./entry-useGoalInReview-CM5zzBQnov.js";import"./entry-goalInReview-DYlaiqNQ-d.js";import"./entry-dateUtils-CovlNEqkb0.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-MyKivaEmailUpdatesCard-u_kOnrenoq.js";import"./entry-useOptIn-cwUxrLItN8.js";import"./entry-ThankYouCard-D6SxnuRD7-.js";import"./entry-MyKivaLatestLoanCard-ruGJr9wEau.js";import"./entry-MyKivaSurveyCard-C-4LGwXBsF.js";import"./entry-useDelayUntilVisible-BO-2eyuPJ_.js";import"./entry-observerUtils-DveHpw6JZJ.js";const Ie={title:"MyKiva/JourneyCardCarousel",component:b,parameters:{chromatic:{viewports:[414,834,1440]}}},s=[T],o=[v,A],l={category:"womens-equality",target:10},U={getCtaHref:()=>"/lend-by-category/women",getGoalDisplayName:(e,r)=>!e||e>1?r==="womens-equality"?"women":"loans":r==="womens-equality"?"woman":"loan",goalProgressPercentage:{value:50},setHideGoalCardPreference:()=>{}},k={query:()=>Promise.resolve({data:{}}),mutate:()=>Promise.resolve({data:{}})},B={get:()=>null,set:()=>{}},t=(e={})=>{const r=(_,{argTypes:x})=>({props:Object.keys(x),components:{JourneyCardCarousel:b},setup(){return{args:e}},provide:{goalData:U,apollo:k,cookieStore:B},template:`
            <div style="max-width: 1200px;">
                <journey-card-carousel v-bind="args" />
            </div>
        `});return r.args=e,r},a=t({slides:o,badgesData:s}),n=t({slides:o,heroBadgeData:s,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!1,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),i=t({slides:o,heroBadgeData:s,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),d=t({slides:o,heroBadgeData:s,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),m=t({slides:o,heroBadgeData:s,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:null,hideGoalCard:!0,goalProgress:0,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]});var p,u,g;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`story({
  slides,
  badgesData
})`,...(g=(u=a.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var c,h,S;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`story({
  slides,
  heroBadgeData: badgesData,
  heroTieredAchievements: [],
  slidesNumber: 3,
  showLendingNextStepsCards: false,
  inLendingStats: true,
  userGoal: mockUserGoal,
  goalProgress: 10,
  goalProgressLoading: false,
  userInfo: {},
  lender: {
    name: 'Test User'
  },
  loans: []
})`,...(S=(h=n.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var L,f,P;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  slides,
  heroBadgeData: badgesData,
  heroTieredAchievements: [],
  slidesNumber: 3,
  showLendingNextStepsCards: true,
  showPostLendingNextStepsCards: true,
  inLendingStats: true,
  userGoal: mockUserGoal,
  goalProgress: 10,
  goalProgressLoading: false,
  userInfo: {},
  lender: {
    name: 'Test User'
  },
  loans: []
})`,...(P=(f=i.parameters)==null?void 0:f.docs)==null?void 0:P.source}}};var C,N,w;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  slides,
  heroBadgeData: badgesData,
  heroTieredAchievements: [],
  slidesNumber: 3,
  showLendingNextStepsCards: true,
  showPostLendingNextStepsCards: true,
  inLendingStats: true,
  userGoal: mockUserGoal,
  goalProgress: 10,
  goalProgressLoading: false,
  userInfo: {},
  lender: {
    name: 'Test User'
  },
  loans: []
})`,...(w=(N=d.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var y,D,G;m.parameters={...m.parameters,docs:{...(y=m.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  slides,
  heroBadgeData: badgesData,
  heroTieredAchievements: [],
  slidesNumber: 3,
  showLendingNextStepsCards: true,
  showPostLendingNextStepsCards: true,
  inLendingStats: true,
  userGoal: null,
  hideGoalCard: true,
  goalProgress: 0,
  goalProgressLoading: false,
  userInfo: {},
  lender: {
    name: 'Test User'
  },
  loans: []
})`,...(G=(D=m.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};const qe=["Default","AlmostFundedDisabled","AlmostFundedBasic","AlmostFundedWithGoal","AlmostFundedNoGoal"];export{i as AlmostFundedBasic,n as AlmostFundedDisabled,m as AlmostFundedNoGoal,d as AlmostFundedWithGoal,a as Default,qe as __namedExportsOrder,Ie as default};
