import{K as d}from"./entry-KvProgressCampaign-Cv_VTC7OJT.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-M9KpJ2J73i.js";import"./entry-KvProgressBar-BPOh-Y8mLz.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const L={title:"Kv/KvProgressCampaign",component:d},p=o=>{const e=(l,{argTypes:c})=>({props:Object.keys(c),components:{KvProgressCampaign:d},setup(){return o},template:`
            <div>
                <kv-progress-campaign
                    :funded-amount="fundedAmount"
                    :total-amount="totalAmount"
                    :days-left="daysLeft"
                    :minimal-stats="minimalStats"
                />
            </div>
        `});return e.args=o,e},t=p({daysLeft:"29",totalAmount:4e3,fundedAmount:462}),a=p({daysLeft:"29",totalAmount:4e3,fundedAmount:462,minimalStats:!0});var s,r,n;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`story({
  daysLeft: '29',
  totalAmount: 4000,
  fundedAmount: 462
})`,...(n=(r=t.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};var m,u,i;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  daysLeft: '29',
  totalAmount: 4000,
  fundedAmount: 462,
  minimalStats: true
})`,...(i=(u=a.parameters)==null?void 0:u.docs)==null?void 0:i.source}}};const _=["Default","MinimalStats"];export{t as Default,a as MinimalStats,_ as __namedExportsOrder,L as default};
