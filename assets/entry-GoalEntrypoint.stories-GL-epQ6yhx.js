import{G as P}from"./entry-GoalEntrypoint-DOFWjLTUar.js";import{l as T}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-GoalSelector-D4Kn_VBriY.js";import"./entry-useBadgeData-_afH1sGXpR.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-D1klFtLQZL.js";import"./entry-imageUtils-BO57SRLi2g.js";import"./entry-contentfulUtils-BSVc25-f1Y.js";import"./entry-index-7WUD3idviV.js";import"./entry-GoalProgressRing-DxqTKWJiVQ.js";import"./entry-vue-router-DIwaDubILI.js";import"./entry-KvProgressCircle-rwpMvimqlV.js";import"./entry-useGoalData-Dmq6xZmbqn.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-flssUtils-LmY1Zv8Ik1.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterUtils-BxjxFhmwJz.js";import"./entry-orderBy-CuF8cTvHI1.js";import"./entry-_baseOrderBy-p4qs5UUyWO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-goalCopy-Awmr2Adxot.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-RecommendLoanForGoalContainer-CqSOWXOhaE.js";import"./entry-RecommendLoanForGoalHeader-DPqGpaVfyz.js";import"./entry-useMultiMatching-C-DxTpkOqU.js";import"./entry-settingsUtils-DyCLv7scRe.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-express-checkout-lines-DZP1mhML8u.js";const E="https://www.kiva.org/img/",c=T[2],O={loan:c,loanId:c.id,photoPath:E,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],Co={title:"MyKiva/GoalEntrypoint",component:P},o=m=>{const i=(b,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:m,recommendLoanCardProps:{...O,kvTrackFunction:()=>{}}}},template:`
            <div style="max-width: 620px;">
                <goal-entrypoint
                    v-bind="args"
                    :recommend-loan-card-props="recommendLoanCardProps"
                />
            </div>
        `});return i.args=m,i},e=o({loading:!0}),t=o({loading:!1,totalLoans:0,tieredAchievements:[]}),a=o({loading:!1,totalLoans:2,categoriesLoanCount:{"womens-equality":2}}),r=o({loading:!1,totalLoans:200,categoriesLoanCount:{"womens-equality":200}}),n=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x}),s=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x,recommendLoanIsInBasket:!0});var p,d,l;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`story({
  loading: true
})`,...(l=(d=e.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var u,L,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 0,
  tieredAchievements: []
})`,...(g=(L=t.parameters)==null?void 0:L.docs)==null?void 0:g.source}}};var h,w,y;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 2,
  categoriesLoanCount: {
    'womens-equality': 2
  }
})`,...(y=(w=a.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var f,k,D;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 200,
  categoriesLoanCount: {
    'womens-equality': 200
  }
})`,...(D=(k=r.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var R,S,v;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`story({
  loading: false,
  showRecommendLoanAfterGoalView: true,
  hasRecommendedLoans: true,
  loadedSetData: true,
  recommendLoanHeaderDetails
})`,...(v=(S=n.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var C,G,I;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  loading: false,
  showRecommendLoanAfterGoalView: true,
  hasRecommendedLoans: true,
  loadedSetData: true,
  recommendLoanHeaderDetails,
  recommendLoanIsInBasket: true
})`,...(I=(G=s.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};const Go=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,a as OneDigitLoans,n as RecommendedLoanExpressCheckout,s as RecommendedLoanInBasket,r as ThreeDigitsLoans,Go as __namedExportsOrder,Co as default};
