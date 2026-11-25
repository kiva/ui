import{_ as P}from"./entry-GoalEntrypoint-CkrwUZMLnj.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-GoalSelector-Ddu8ogovYy.js";import"./entry-mdi-CqWyar1Kn0.js";import"./entry-KvButton-DhnDSkEAjx.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-useBadgeData-sXRJsH_zBc.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-C4y7wIEqHF.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-CWtQNCE4aD.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tokens-Cdn1heMTVo.js";import"./entry-GoalProgressRing-DQmCv-g9OU.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-KvProgressCircle-CJzowGz-P_.js";import"./entry-useGoalData-C9Ki20S9TH.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-userPreferenceUtils-CND_2oBzoj.js";import"./entry-flssUtils-CvbChVVTMZ.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-DEAS3GXiOC.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-filterUtils-D-4UasJaYo.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-BRVyLNfZZN.js";import"./entry-goalCopy-BFTeZ1M0uD.js";import"./entry-get-URTN0AnQsa.js";import"./entry-goalInReview-dtsZpw6kKR.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-BjwKhfFwPW.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-experimentUtils-DqnnT3YOzV.js";import"./entry-settingsUtils-DmiCd-vQln.js";import"./entry-RecommendLoanForGoalContainer-1Vf9TpDXNH.js";import"./entry-RecommendLoanForGoalHeader-CblHYgCEGa.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvLendCta-hzambwSjHV.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-index-B2fPe4RJm7.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-loanUtils-qciDU5Aj3L.js";import"./entry-KvSelect-CnLHoSohvf.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvLoanTeamPick-AFS9U1KAYr.js";import"./entry-KvProgressBar-DXl-MzWqVJ.js";import"./entry-index-BmqS9vrVZ6.js";import"./entry-index-RkAYAUfJHC.js";import"./entry-index-DrXNim1j4v.js";import"./entry-index-D39skEuOvm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-index-BwE6orlohw.js";import"./entry-index-DDCoMUF_Su.js";import"./entry-index-B7Y4crKsa-.js";import"./entry-KvTooltip-CzdA3mHRRT.js";import"./iframe-DlmYCqVl.js";import"./entry-kivaColors-BJyFMChe18.js";import"./entry-KvBorrowerImage-CWRF8_GjA7.js";import"./entry-useMultiMatching-DVwkv29WRj.js";import"./entry-useApolloQuery-Dvuff6giSC.js";import"./entry-lazyApolloOperation-COqpNXNIst.js";import"./entry-observerUtils-Cg16I4RRYc.js";const T="https://www.kiva.org/img/",p=G[2],E={loan:p,loanId:p.id,photoPath:T,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],ce={title:"MyKiva/GoalEntrypoint",component:P},o=s=>{const i=(O,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:s,recommendLoanCardProps:{...E,kvTrackFunction:()=>{}}}},template:`
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
})`,...(I=(C=m.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const de=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,r as OneDigitLoans,n as RecommendedLoanExpressCheckout,m as RecommendedLoanInBasket,a as ThreeDigitsLoans,de as __namedExportsOrder,ce as default};
