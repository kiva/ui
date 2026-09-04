import{_ as b,w as v,j as A}from"./entry-my-kiva-slides-mock-Cj3MYm30CV.js";import{c as T}from"./entry-badge-journey-data-mock-CA_V6NnPCv.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-useBreakpoints-CQUCSDShEn.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-achievementUtils-DQbJirzL4R.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-contentfulUtils-BhganbZZnz.js";import"./entry-index-7WUD3idviV.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-useBadgeData-BM_PPpZWd3.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-KvCarousel-k9ZnBQxvjJ.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-MyKivaCard-jxcedgUMo2.js";import"./entry-NextYearGoalCard-YVl1IwA6za.js";import"./entry-useGoalData-CGxKGkbOuM.js";import"./entry-flssUtils-B88iANwyB2.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-5YY4tepa23.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-iPSOJk4XXi.js";import"./entry-_baseOrderBy-KaK2JLUByg.js";import"./entry-get-ClabG2OWPD.js";import"./entry-_baseMap-CIOY77EeAM.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-goalCopy-BdzkadAqJg.js";import"./entry-vue-router-FhvgPHqR7g.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-DmCBb1HGS6.js";import"./entry-KvProgressCircle-BkwnSJB5ye.js";import"./entry-goalInReview-DBDaSELZMk.js";import"./entry-dateUtils-qZzGtZF0jQ.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-MyKivaEmailUpdatesCard-28bU033nkb.js";import"./entry-useOptIn-cwUxrLItN8.js";import"./entry-ThankYouCard-xhLIyYljip.js";import"./entry-MyKivaLatestLoanCard-C44DlIJ5QC.js";import"./entry-MyKivaSurveyCard-4wM_pIG6TN.js";import"./entry-useGoalInReview-CP1jc9zlCa.js";import"./entry-useDelayUntilVisible-BYQfjKgvAd.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-kiva_k-DzDbbfmjWV.js";const je={title:"MyKiva/JourneyCardCarousel",component:b,parameters:{chromatic:{viewports:[414,834,1440]}}},s=[T],o=[v,A],l={category:"womens-equality",target:10},U={getCtaHref:()=>"/lend-by-category/women",getGoalDisplayName:(e,r)=>!e||e>1?r==="womens-equality"?"women":"loans":r==="womens-equality"?"woman":"loan",goalProgressPercentage:{value:50},setHideGoalCardPreference:()=>{}},k={query:()=>Promise.resolve({data:{}}),mutate:()=>Promise.resolve({data:{}})},B={get:()=>null,set:()=>{}},t=(e={})=>{const r=(_,{argTypes:x})=>({props:Object.keys(x),components:{JourneyCardCarousel:b},setup(){return{args:e}},provide:{goalData:U,apollo:k,cookieStore:B},template:`
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
})`,...(G=(D=m.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};const Je=["Default","AlmostFundedDisabled","AlmostFundedBasic","AlmostFundedWithGoal","AlmostFundedNoGoal"];export{i as AlmostFundedBasic,n as AlmostFundedDisabled,m as AlmostFundedNoGoal,d as AlmostFundedWithGoal,a as Default,Je as __namedExportsOrder,je as default};
