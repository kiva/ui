import{_ as P}from"./entry-GoalEntrypoint-D7ChwOJIXJ.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-GoalSelector-Bz08X5ORuO.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-KvButton-C8S99vq6YZ.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-useBadgeData-Cne6ifq3GA.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-Czo-s8jp_f.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BxnXHmGqQJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-tokens-B1GtbUGZM0.js";import"./entry-GoalProgressRing-CuuKTLi5uq.js";import"./entry-vue-router-DJm5fYqkEO.js";import"./entry-KvProgressCircle-BdWqRhpYNV.js";import"./entry-useGoalData-Ca-l9jJ9X4.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-index-CWclSTHHJk.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-useGoalInReview-NsJEYspHlF.js";import"./entry-goalInReview-zdLSpaXyvq.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-goalCopy-lrFfIjZjvL.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-RecommendLoanForGoalContainer-DVFwvH5k_T.js";import"./entry-RecommendLoanForGoalHeader-DV5K1gzAoR.js";import"./entry-KvLendCta2-DEoOb_Knh6.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvSelect-C-r_AQ0WU4.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvLoanTeamPick-4Q5heVP9wz.js";import"./entry-KvProgressBar-g7jVHBYsQw.js";import"./entry-index-BmqS9vrVZ6.js";import"./entry-index-RkAYAUfJHC.js";import"./entry-index-B2fPe4RJm7.js";import"./entry-index-DrXNim1j4v.js";import"./entry-index-D39skEuOvm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-index-BwE6orlohw.js";import"./entry-index-DDCoMUF_Su.js";import"./entry-index-B7Y4crKsa-.js";import"./entry-KvTooltip-CVM0jGeusF.js";import"./iframe-DmiUPxZA.js";import"./entry-kivaColors-BS05vDKEa3.js";import"./entry-KvBorrowerImage-CSLyDHr5cq.js";import"./entry-useMultiMatching-DsGXZdPz3i.js";import"./entry-settingsUtils-Bvzm0W_q6G.js";import"./entry-get-URTN0AnQsa.js";import"./entry-useApolloQuery-F9DRKPKE75.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";const T="https://www.kiva.org/img/",p=G[2],E={loan:p,loanId:p.id,photoPath:T,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],ne={title:"MyKiva/GoalEntrypoint",component:P},o=m=>{const i=(O,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:m,recommendLoanCardProps:{...E,kvTrackFunction:()=>{}}}},template:`
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
