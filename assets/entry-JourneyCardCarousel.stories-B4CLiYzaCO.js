import{_ as b,w as v,j as A}from"./entry-my-kiva-slides-mock-DtUOHPwkqK.js";import{c as T}from"./entry-badge-journey-data-mock-CA_V6NnPCv.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-useBreakpoints-D2Vnrk3Mt0.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tokens-B1GtbUGZM0.js";import"./entry-achievementUtils-Czo-s8jp_f.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-contentfulUtils-BxnXHmGqQJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-useBadgeData-Cne6ifq3GA.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-KvCarousel-CYX6fjoQBh.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvButton-C8S99vq6YZ.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";import"./entry-KvLightbox-DVXBz7pz3Z.js";import"./entry-printing-CRk90741Y_.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-MyKivaCard-BNxvr78KVo.js";import"./iframe-DmiUPxZA.js";import"./entry-KvBorrowerImage-CSLyDHr5cq.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-NextYearGoalCard-D60pmmKfFZ.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-useGoalData-Ca-l9jJ9X4.js";import"./entry-index-CWclSTHHJk.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-goalCopy-lrFfIjZjvL.js";import"./entry-vue-router-DJm5fYqkEO.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-CuuKTLi5uq.js";import"./entry-KvProgressCircle-BdWqRhpYNV.js";import"./entry-useGoalInReview-NsJEYspHlF.js";import"./entry-goalInReview-zdLSpaXyvq.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-MyKivaEmailUpdatesCard-DVXkybFDca.js";import"./entry-useOptIn-cwUxrLItN8.js";import"./entry-ThankYouCard-sDR5hfPHEq.js";import"./entry-MyKivaLatestLoanCard-DeuQa7890h.js";import"./entry-MyKivaSurveyCard-pp7QjTqRG0.js";import"./entry-useDelayUntilVisible-C_2EFrzg1c.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-index-B2fPe4RJm7.js";const Ze={title:"MyKiva/JourneyCardCarousel",component:b,parameters:{chromatic:{viewports:[414,834,1440]}}},o=[T],s=[v,A],l={category:"womens-equality",target:10},U={getCtaHref:()=>"/lend-by-category/women",getGoalDisplayName:(e,r)=>!e||e>1?r==="womens-equality"?"women":"loans":r==="womens-equality"?"woman":"loan",goalProgressPercentage:{value:50},setHideGoalCardPreference:()=>{}},k={query:()=>Promise.resolve({data:{}}),mutate:()=>Promise.resolve({data:{}})},B={get:()=>null,set:()=>{}},t=(e={})=>{const r=(_,{argTypes:x})=>({props:Object.keys(x),components:{JourneyCardCarousel:b},setup(){return{args:e}},provide:{goalData:U,apollo:k,cookieStore:B},template:`
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
})`,...(G=(D=d.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};const $e=["Default","AlmostFundedDisabled","AlmostFundedBasic","AlmostFundedWithGoal","AlmostFundedNoGoal"];export{i as AlmostFundedBasic,n as AlmostFundedDisabled,d as AlmostFundedNoGoal,m as AlmostFundedWithGoal,a as Default,$e as __namedExportsOrder,Ze as default};
