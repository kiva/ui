import{_ as b,w as v,j as A}from"./entry-my-kiva-slides-mock-D4HszgXB80.js";import{c as T}from"./entry-badge-journey-data-mock-CA_V6NnPCv.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-useBreakpoints-CzoVq03VU2.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tokens-Cdn1heMTVo.js";import"./entry-achievementUtils-C4y7wIEqHF.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-contentfulUtils-CWtQNCE4aD.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-useBadgeData-sXRJsH_zBc.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-KvCarousel-Cip9agtjZE.js";import"./entry-mdi-DPwWwISsJs.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvButton-BdG-Dl0jtV.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-KvLightbox-CTfqxGksPQ.js";import"./entry-printing-DwWJHhrrq-.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-MyKivaCard-C6FzIPoU4e.js";import"./iframe-CBc9wpf4.js";import"./entry-KvBorrowerImage-CWRF8_GjA7.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-NextYearGoalCard-Dx_Gi6q1Bc.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-useGoalData-C9Ki20S9TH.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-userPreferenceUtils-CND_2oBzoj.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-flssUtils-CvbChVVTMZ.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-DEAS3GXiOC.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-filterUtils-D-4UasJaYo.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-BRVyLNfZZN.js";import"./entry-goalCopy-BFTeZ1M0uD.js";import"./entry-get-URTN0AnQsa.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-CMUgRJXXKD.js";import"./entry-KvProgressCircle-CJzowGz-P_.js";import"./entry-goalInReview-B_CxhC6XMj.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-BjwKhfFwPW.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-MyKivaEmailUpdatesCard-BV5Yxi5IEF.js";import"./entry-useOptIn-cwUxrLItN8.js";import"./entry-index-CWclSTHHJk.js";import"./entry-ThankYouCard-DyqCET9Cba.js";import"./entry-MyKivaLatestLoanCard-DMgGoHDeef.js";import"./entry-MyKivaSurveyCard-DOGogwfkdZ.js";import"./entry-useGoalInReview-D2DindXvJN.js";import"./entry-useDelayUntilVisible-BO1WaYE2LQ.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-givingFundUtils-DbBAppaSM4.js";import"./entry-index-B2fPe4RJm7.js";const sr={title:"MyKiva/JourneyCardCarousel",component:b,parameters:{chromatic:{viewports:[414,834,1440]}}},o=[T],s=[v,A],l={category:"womens-equality",target:10},U={getCtaHref:()=>"/lend-by-category/women",getGoalDisplayName:(e,r)=>!e||e>1?r==="womens-equality"?"women":"loans":r==="womens-equality"?"woman":"loan",goalProgressPercentage:{value:50},setHideGoalCardPreference:()=>{}},k={query:()=>Promise.resolve({data:{}}),mutate:()=>Promise.resolve({data:{}})},B={get:()=>null,set:()=>{}},t=(e={})=>{const r=(_,{argTypes:x})=>({props:Object.keys(x),components:{JourneyCardCarousel:b},setup(){return{args:e}},provide:{goalData:U,apollo:k,cookieStore:B},template:`
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
})`,...(G=(D=d.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};const tr=["Default","AlmostFundedDisabled","AlmostFundedBasic","AlmostFundedWithGoal","AlmostFundedNoGoal"];export{i as AlmostFundedBasic,n as AlmostFundedDisabled,d as AlmostFundedNoGoal,m as AlmostFundedWithGoal,a as Default,tr as __namedExportsOrder,sr as default};
