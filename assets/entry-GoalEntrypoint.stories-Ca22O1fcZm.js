import{_ as h}from"./entry-GoalEntrypoint-DNWxPcosMc.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvLoadingPlaceholder-C8l3iom59y.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-GoalSelector-DZPawWv0Ub.js";import"./entry-useBadgeData-BF_2MyxYqK.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-hands-plant-BAv0tdeAla.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-KvMaterialIcon-B1UgUIVXS0.js";import"./entry-KvButton-2WLASe3tCZ.js";import"./entry-KvLoadingSpinner-B-Httn77Py.js";import"./entry-useGoalData-N58TBux3W6.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const z={title:"MyKiva/GoalEntrypoint",component:h},r=s=>{const n=(w,{argTypes:v})=>({props:Object.keys(v),components:{GoalEntrypoint:h},setup(){return s},template:`
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
})`,...(_=(f=a.parameters)==null?void 0:f.docs)==null?void 0:_.source}}};const B=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans"];export{o as Loading,t as NoWomenLoansPastYear,e as OneDigitLoans,a as ThreeDigitsLoans,B as __namedExportsOrder,z as default};
