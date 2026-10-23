import{_ as b,w as v,j as A}from"./entry-my-kiva-slides-mock-BCU7rAEk4B.js";import{c as T}from"./entry-badge-journey-data-mock-CA_V6NnPCv.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-useBreakpoints-Jf4vCASJDD.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-achievementUtils-C6NQioJq3q.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-contentfulUtils-BhgUSuS-pN.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-useBadgeData-BqSgdXIXRa.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-KvCarousel-DHknGMZ0fm.js";import"./entry-mdi-CvwCDwZH7q.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-KvLightbox-BrMDhnobRV.js";import"./entry-printing-DMx4lS_4Te.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-MyKivaCard-CUuGjiDesk.js";import"./iframe-DuiMrmqs.js";import"./entry-KvBorrowerImage-D8bSIb1Xhp.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-NextYearGoalCard-0TlGvMMpRk.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-useGoalData-eJAPWkGMDq.js";import"./entry-userPreferenceUtils-CND_2oBzoj.js";import"./entry-flssUtils-C5lItVEH3k.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-FQH45DUwPz.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-goalCopy-BDRauElTZi.js";import"./entry-vue-router-Zhl8QJ3lVg.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-Cl2I8rV3dF.js";import"./entry-KvProgressCircle-8R1WpjpRVF.js";import"./entry-useGoalInReview-DOJI_R4qhx.js";import"./entry-goalInReview-BOP97FEcUj.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-MyKivaEmailUpdatesCard-azczHIUlOq.js";import"./entry-useOptIn-cwUxrLItN8.js";import"./entry-index-CWclSTHHJk.js";import"./entry-ThankYouCard-DyeHGmjmvO.js";import"./entry-MyKivaLatestLoanCard-DqO7MiFLaE.js";import"./entry-MyKivaSurveyCard-BCO2MeHV1h.js";import"./entry-useDelayUntilVisible-BiyHuOBzlF.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-index-B2fPe4RJm7.js";const $e={title:"MyKiva/JourneyCardCarousel",component:b,parameters:{chromatic:{viewports:[414,834,1440]}}},o=[T],s=[v,A],l={category:"womens-equality",target:10},U={getCtaHref:()=>"/lend-by-category/women",getGoalDisplayName:(e,r)=>!e||e>1?r==="womens-equality"?"women":"loans":r==="womens-equality"?"woman":"loan",goalProgressPercentage:{value:50},setHideGoalCardPreference:()=>{}},k={query:()=>Promise.resolve({data:{}}),mutate:()=>Promise.resolve({data:{}})},B={get:()=>null,set:()=>{}},t=(e={})=>{const r=(_,{argTypes:x})=>({props:Object.keys(x),components:{JourneyCardCarousel:b},setup(){return{args:e}},provide:{goalData:U,apollo:k,cookieStore:B},template:`
            <div style="max-width: 1200px;">
                <journey-card-carousel v-bind="args" />
            </div>
        `});return r.args=e,r},a=t({slides:s,badgesData:o}),n=t({slides:s,heroBadgeData:o,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!1,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),i=t({slides:s,heroBadgeData:o,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),m=t({slides:s,heroBadgeData:o,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:l,goalProgress:10,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]}),d=t({slides:s,heroBadgeData:o,heroTieredAchievements:[],slidesNumber:3,showLendingNextStepsCards:!0,showPostLendingNextStepsCards:!0,inLendingStats:!0,userGoal:null,hideGoalCard:!0,goalProgress:0,goalProgressLoading:!1,userInfo:{},lender:{name:"Test User"},loans:[]});var p,u,g;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`story({
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
})`,...(P=(f=i.parameters)==null?void 0:f.docs)==null?void 0:P.source}}};var C,N,w;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`story({
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
})`,...(w=(N=m.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var y,D,G;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`story({
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
})`,...(G=(D=d.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};const er=["Default","AlmostFundedDisabled","AlmostFundedBasic","AlmostFundedWithGoal","AlmostFundedNoGoal"];export{i as AlmostFundedBasic,n as AlmostFundedDisabled,d as AlmostFundedNoGoal,m as AlmostFundedWithGoal,a as Default,er as __namedExportsOrder,$e as default};
