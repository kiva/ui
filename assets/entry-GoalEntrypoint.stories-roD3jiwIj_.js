import{_ as h}from"./entry-GoalEntrypoint-CEtRg-CHt3.js";import"./entry-vue.esm-bundler-BthIfLPEGH.js";import"./entry-KvLoadingPlaceholder-aJYFcp9wXs.js";import"./entry-KvWwwHeader-COss86YtUr.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-GoalSelector-DncSQJTZN_.js";import"./entry-useBadgeData-BC7POqnW8v.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-mdi-CxS5kPhO5v.js";import"./entry-KvMaterialIcon-DjW6IUJXeQ.js";import"./entry-KvButton-p9fkQMtQm5.js";import"./entry-KvLoadingSpinner-BCoIpoxPqz.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const k={title:"MyKiva/GoalEntrypoint",component:h},r=s=>{const n=(w,{argTypes:v})=>({props:Object.keys(v),components:{GoalEntrypoint:h},setup(){return s},template:`
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
})`,...(_=(f=a.parameters)==null?void 0:f.docs)==null?void 0:_.source}}};const K=["Loading","NoWomenLoansPastYear","OneDigitLoans","ThreeDigitsLoans"];export{o as Loading,t as NoWomenLoansPastYear,e as OneDigitLoans,a as ThreeDigitsLoans,K as __namedExportsOrder,k as default};
