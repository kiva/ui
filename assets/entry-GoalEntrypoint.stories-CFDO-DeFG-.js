import{_ as P}from"./entry-GoalEntrypoint-YoSv3xELQx.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-GoalSelector-dmegoMQobc.js";import"./entry-mdi-biBz7_Qm9W.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-useBadgeData-BzjJjcH6YG.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-C6NQioJq3q.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BhgUSuS-pN.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-GoalProgressRing-Dc6DZOqnB6.js";import"./entry-vue-router-Zhl8QJ3lVg.js";import"./entry-KvProgressCircle-8R1WpjpRVF.js";import"./entry-useGoalData-BVgcy764t1.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-flssUtils-C5lItVEH3k.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-FQH45DUwPz.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-useGoalInReview-DZP5zfRztG.js";import"./entry-goalInReview-9SB5qMZBJo.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-goalCopy-DEtDHMFUgc.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-RecommendLoanForGoalContainer-Ah-GxivJic.js";import"./entry-RecommendLoanForGoalHeader-Dk3zpRpsAz.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvLendCta-DS-MRc4ooh.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvSelect--zYwmwwtuR.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvLoanTeamPick-DLeo-UUuwt.js";import"./entry-KvProgressBar-de3RqIcCVv.js";import"./entry-index-BmqS9vrVZ6.js";import"./entry-index-RkAYAUfJHC.js";import"./entry-index-B2fPe4RJm7.js";import"./entry-index-DrXNim1j4v.js";import"./entry-index-D39skEuOvm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-index-BwE6orlohw.js";import"./entry-index-DDCoMUF_Su.js";import"./entry-index-B7Y4crKsa-.js";import"./entry-KvTooltip-UYjFsxyAVX.js";import"./iframe-dshMxl37.js";import"./entry-kivaColors-CtWaAVoWDc.js";import"./entry-KvBorrowerImage-D8bSIb1Xhp.js";import"./entry-useMultiMatching-DMW-uZksXR.js";import"./entry-settingsUtils-CE5WCSqwht.js";import"./entry-get-URTN0AnQsa.js";import"./entry-useApolloQuery-DzwiBjTbWW.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";const T="https://www.kiva.org/img/",p=G[2],E={loan:p,loanId:p.id,photoPath:T,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],ne={title:"MyKiva/GoalEntrypoint",component:P},o=m=>{const i=(O,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:m,recommendLoanCardProps:{...E,kvTrackFunction:()=>{}}}},template:`
            <div style="max-width: 620px;">
                <goal-entrypoint
                    v-bind="args"
                    :recommend-loan-card-props="recommendLoanCardProps"
                />
            </div>
        `});return i.args=m,i},e=o({loading:!0}),t=o({loading:!1,totalLoans:0,tieredAchievements:[]}),r=o({loading:!1,totalLoans:2,categoriesLoanCount:{"womens-equality":2}}),a=o({loading:!1,totalLoans:200,categoriesLoanCount:{"womens-equality":200}}),n=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x}),s=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x,recommendLoanIsInBasket:!0});var c,d,l;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`story({
  loading: true
})`,...(l=(d=e.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var u,L,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 0,
  tieredAchievements: []
})`,...(g=(L=t.parameters)==null?void 0:L.docs)==null?void 0:g.source}}};var h,w,f;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 2,
  categoriesLoanCount: {
    'womens-equality': 2
  }
})`,...(f=(w=r.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var y,k,D;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 200,
  categoriesLoanCount: {
    'womens-equality': 200
  }
})`,...(D=(k=a.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var R,S,_;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`story({
  loading: false,
  showRecommendLoanAfterGoalView: true,
  hasRecommendedLoans: true,
  loadedSetData: true,
  recommendLoanHeaderDetails
})`,...(_=(S=n.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var v,C,I;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  loading: false,
  showRecommendLoanAfterGoalView: true,
  hasRecommendedLoans: true,
  loadedSetData: true,
  recommendLoanHeaderDetails,
  recommendLoanIsInBasket: true
})`,...(I=(C=s.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const se=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,r as OneDigitLoans,n as RecommendedLoanExpressCheckout,s as RecommendedLoanInBasket,a as ThreeDigitsLoans,se as __namedExportsOrder,ne as default};
