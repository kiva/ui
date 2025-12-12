import{_ as h}from"./entry-GoalEntrypoint-WLQyvtszVC.js";import"./entry-vue.esm-bundler-BthIfLPEGH.js";import"./entry-KvLoadingPlaceholder-BfNe1stGvO.js";import"./entry-KvWwwHeader-CoZoGmfOYd.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-GoalSelector-Jy0zPwpkmt.js";import"./entry-useBadgeData-B8TrHL8kpc.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-hands-plant-BJO6ok8SLE.js";import"./entry-thumbs-up-Di9UhQH0u4.js";import"./entry-mdi-CxS5kPhO5v.js";import"./entry-KvMaterialIcon-xI3aqUMDCm.js";import"./entry-KvButton-CYQmlfiI14.js";import"./entry-KvLoadingSpinner-DdrXvKPVNY.js";import"./entry-useGoalData-CKQM3usove.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const B={title:"MyKiva/GoalEntrypoint",component:h},r=s=>{const n=(w,{argTypes:v})=>({props:Object.keys(v),components:{GoalEntrypoint:h},setup(){return s},template:`
            <div style="max-width: 620px;">
                <goal-entrypoint
                    :loading="loading"
                    :total-loans="totalLoans"
                    :categories-loan-count="categoriesLoanCount"
                />
            </div>
        `});return n.args=s,n},o=r({loading:!0}),t=r({loading:!1,totalLoans:0,tieredAchievements:[]}),e=r({loading:!1,totalLoans:2,categoriesLoanCount:{"womens-equality":2}}),a=r({loading:!1,totalLoans:200,categoriesLoanCount:{"womens-equality":200}});var i,m,p;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`story({
  loading: true
})`,...(p=(m=o.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var c,l,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 0,
  tieredAchievements: []
})`,...(d=(l=t.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var g,u,L;e.parameters={...e.parameters,docs:{...(g=e.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 2,
  categoriesLoanCount: {
    "womens-equality": 2
  }
})`,...(L=(u=e.parameters)==null?void 0:u.docs)==null?void 0:L.source}}};var y,f,_;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loading: false,
  totalLoans: 200,
  categoriesLoanCount: {
    "womens-equality": 200
  }
})`,...(_=(f=a.parameters)==null?void 0:f.docs)==null?void 0:_.source}}};const F=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans"];export{o as Loading,t as NoWomenLoansPastYear,e as OneDigitLoans,a as ThreeDigitsLoans,F as __namedExportsOrder,B as default};
