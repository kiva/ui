import{_ as P}from"./entry-GoalEntrypoint-DaB-Oh3uv_.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-DjLyFRslqj.js";import"./entry-KvWwwHeaderBasic-C_kuFZZQmp.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-ykU41f_qhj.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-agQorjtY.js";import"./entry-GoalSelector-C-0AXFkG1r.js";import"./entry-useBadgeData-DV1-MrltJl.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-4YR0vuRrR2.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BYNyFhm6CJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-GoalProgressRing-CojvDnV-NW.js";import"./entry-vue-router-D4k6g03Mt4.js";import"./entry-KvProgressCircle-Cm0r15F9k1.js";import"./entry-useGoalData-C8JmTMUqoc.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-useGoalInReview-CM5zzBQnov.js";import"./entry-goalInReview-DYlaiqNQ-d.js";import"./entry-dateUtils-CovlNEqkb0.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-goalCopy-jhaVZ1HBO_.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-RecommendLoanForGoalContainer-nQQMN2RDwM.js";import"./entry-RecommendLoanForGoalHeader-Ce9UfFvz0t.js";import"./entry-useMultiMatching-CKXSHuZVC4.js";import"./entry-settingsUtils-ClNbELb3kn.js";import"./entry-get-URTN0AnQsa.js";import"./entry-useApolloQuery-K1P_i_88t-.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-express-checkout-lines-B00R1Y6tHl.js";const T="https://www.kiva.org/img/",p=G[2],E={loan:p,loanId:p.id,photoPath:T,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],Go={title:"MyKiva/GoalEntrypoint",component:P},o=m=>{const i=(O,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:m,recommendLoanCardProps:{...E,kvTrackFunction:()=>{}}}},template:`
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
})`,...(I=(C=s.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const To=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,r as OneDigitLoans,n as RecommendedLoanExpressCheckout,s as RecommendedLoanInBasket,a as ThreeDigitsLoans,To as __namedExportsOrder,Go as default};
