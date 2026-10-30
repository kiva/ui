import{_ as P}from"./entry-GoalEntrypoint-DI5kkBBEet.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-GoalSelector-BC91GUfYMx.js";import"./entry-mdi-CvwCDwZH7q.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-useBadgeData-BqSgdXIXRa.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-C6NQioJq3q.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BhgUSuS-pN.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-GoalProgressRing-C4Uy9pJE7B.js";import"./entry-vue-router-Zhl8QJ3lVg.js";import"./entry-KvProgressCircle-8R1WpjpRVF.js";import"./entry-useGoalData-eJAPWkGMDq.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-userPreferenceUtils-CND_2oBzoj.js";import"./entry-flssUtils-C5lItVEH3k.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-FQH45DUwPz.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-useGoalInReview-DOJI_R4qhx.js";import"./entry-goalInReview-BOP97FEcUj.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-goalCopy-CLAeaDZFGt.js";import"./entry-get-URTN0AnQsa.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-experimentUtils-xM26OwR0y4.js";import"./entry-settingsUtils-CE5WCSqwht.js";import"./entry-RecommendLoanForGoalContainer-CX5Weda6_T.js";import"./entry-RecommendLoanForGoalHeader-C9biDO5VEM.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvLendCta-FFR6ri_lDE.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-loanUtils-qciDU5Aj3L.js";import"./entry-KvSelect-Dd7nTHPgNL.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvLoanTeamPick-6rnIQq-VWR.js";import"./entry-KvProgressBar-de3RqIcCVv.js";import"./entry-index-BmqS9vrVZ6.js";import"./entry-index-RkAYAUfJHC.js";import"./entry-index-B2fPe4RJm7.js";import"./entry-index-DrXNim1j4v.js";import"./entry-index-D39skEuOvm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-index-BwE6orlohw.js";import"./entry-index-DDCoMUF_Su.js";import"./entry-index-B7Y4crKsa-.js";import"./entry-KvTooltip-ByFQmp4TZZ.js";import"./iframe-aLEpHjHA.js";import"./entry-kivaColors-CtWaAVoWDc.js";import"./entry-KvBorrowerImage-D8bSIb1Xhp.js";import"./entry-useMultiMatching-DMW-uZksXR.js";import"./entry-useApolloQuery-DzwiBjTbWW.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";const T="https://www.kiva.org/img/",p=G[2],E={loan:p,loanId:p.id,photoPath:T,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],ie={title:"MyKiva/GoalEntrypoint",component:P},o=s=>{const i=(O,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:s,recommendLoanCardProps:{...E,kvTrackFunction:()=>{}}}},template:`
            <div style="max-width: 620px;">
                <goal-entrypoint
                    v-bind="args"
                    :recommend-loan-card-props="recommendLoanCardProps"
                />
            </div>
        `});return i.args=s,i},e=o({loading:!0}),t=o({loading:!1,totalLoans:0,tieredAchievements:[]}),r=o({loading:!1,totalLoans:2,categoriesLoanCount:{"womens-equality":2}}),a=o({loading:!1,totalLoans:200,categoriesLoanCount:{"womens-equality":200}}),n=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x}),m=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x,recommendLoanIsInBasket:!0});var c,d,l;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`story({
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
})`,...(_=(S=n.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var v,C,I;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  loading: false,
  showRecommendLoanAfterGoalView: true,
  hasRecommendedLoans: true,
  loadedSetData: true,
  recommendLoanHeaderDetails,
  recommendLoanIsInBasket: true
})`,...(I=(C=m.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const pe=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,r as OneDigitLoans,n as RecommendedLoanExpressCheckout,m as RecommendedLoanInBasket,a as ThreeDigitsLoans,pe as __namedExportsOrder,ie as default};
