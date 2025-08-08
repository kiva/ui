import{K as p}from"./entry-KvProgressCampaign-DesBC_wTEp.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-6I7BZrzll1.js";import"./entry-KvWwwHeader-H1zV_3ei7j.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-KvProgressBar-CGDZbWh0eE.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const _={title:"Kv/KvProgressCampaign",component:p},d=a=>{const e=(l,{argTypes:c})=>({props:Object.keys(c),components:{KvProgressCampaign:p},setup(){return a},template:`
            <div>
                <kv-progress-campaign
                    :funded-amount="fundedAmount"
                    :total-amount="totalAmount"
                    :days-left="daysLeft"
                    :minimal-stats="minimalStats"
                />
            </div>
        `});return e.args=a,e},t=d({daysLeft:"29",totalAmount:4e3,fundedAmount:462}),o=d({daysLeft:"29",totalAmount:4e3,fundedAmount:462,minimalStats:!0});var s,r,n;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`story({
  daysLeft: '29',
  totalAmount: 4000,
  fundedAmount: 462
})`,...(n=(r=t.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};var m,i,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  daysLeft: '29',
  totalAmount: 4000,
  fundedAmount: 462,
  minimalStats: true
})`,...(u=(i=o.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const C=["Default","MinimalStats"];export{t as Default,o as MinimalStats,C as __namedExportsOrder,_ as default};
