import{G as P}from"./entry-GoalEntrypoint-Bx1opDGgET.js";import{l as T}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-GoalSelector-DqTYBLB91i.js";import"./entry-KvAccordionItem-Crrehdxn9w.js";import"./entry-useBadgeData-DEkzn0bjyJ.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-DcTubJ55vm.js";import"./entry-imageUtils-BO57SRLi2g.js";import"./entry-contentfulUtils-JT_-ZZ_Xjb.js";import"./entry-index-Dew-HucFLB.js";import"./entry-GoalProgressRing-DrH6MkniBe.js";import"./entry-vue-router-DMPYrtx6MO.js";import"./entry-KvProgressCircle-C9dUbhfhhK.js";import"./entry-useGoalData-DZRM4VLdpn.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-flssUtils-Dvro--xiTZ.js";import"./entry-loanCardFields-C8Gn393jhu.js";import"./entry-filterUtils-BxjxFhmwJz.js";import"./entry-orderBy-CIk3iUp8RR.js";import"./entry-_baseOrderBy-BPsxOUZwUK.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-C_yvelnzih.js";import"./entry-keys-Bpp3ntPRcJ.js";import"./entry-goalCopy-DD5tgFDmMt.js";import"./entry-useBreakpoints-C2NBIsKhxe.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-RecommendLoanForGoalContainer-CUR8y0_G_c.js";import"./entry-RecommendLoanForGoalHeader-D-1EiW1IfX.js";import"./entry-useMultiMatching-BiI1aeyHJI.js";import"./entry-settingsUtils-XGNYGjbQmx.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-express-checkout-lines-CJs3Vl_oNy.js";const E="https://www.kiva.org/img/",p=T[2],O={loan:p,loanId:p.id,photoPath:E,showTags:!0,externalLinks:!0,customLoanDetails:!0,showLightView:!0,basketItems:[],route:{}},x=["12 loan goal","Women","2 loans completed"],Io={title:"MyKiva/GoalEntrypoint",component:P},o=m=>{const i=(b,{argTypes:A})=>({props:Object.keys(A),components:{GoalEntrypoint:P},setup(){return{args:m,recommendLoanCardProps:{...O,kvTrackFunction:()=>{}}}},template:`
            <div style="max-width: 620px;">
                <goal-entrypoint
                    v-bind="args"
                    :recommend-loan-card-props="recommendLoanCardProps"
                />
            </div>
        `});return i.args=m,i},e=o({loading:!0}),t=o({loading:!1,totalLoans:0,tieredAchievements:[]}),a=o({loading:!1,totalLoans:2,categoriesLoanCount:{"womens-equality":2}}),r=o({loading:!1,totalLoans:200,categoriesLoanCount:{"womens-equality":200}}),n=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x}),s=o({loading:!1,showRecommendLoanAfterGoalView:!0,hasRecommendedLoans:!0,loadedSetData:!0,recommendLoanHeaderDetails:x,recommendLoanIsInBasket:!0});var c,d,l;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`story({
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
})`,...(I=(G=s.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};const Po=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans","RecommendedLoanExpressCheckout","RecommendedLoanInBasket"];export{e as Loading,t as NoWomenLoansPastYear,a as OneDigitLoans,n as RecommendedLoanExpressCheckout,s as RecommendedLoanInBasket,r as ThreeDigitsLoans,Po as __namedExportsOrder,Io as default};
