import{A as c}from"./entry-AppealBannerCircular-DdbP3baY-W.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvMaterialIcon-Do7tkng7tH.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvWideLoanCard-UZGuFHBpxm.js";import"./entry-KvProgressCircle-CuWy2zKxMj.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-CDAm7sgGzJ.js";import"./entry-KvLoadingSpinner-D8lUagFo7U.js";import"./entry-numeral-CmvrP3KSIW.js";import"./entry-KvContentfulImg-wuAA_lEdpv.js";import"./entry-KvPageContainer-i_M91NdDU9.js";const r={targetAmount:45e4,amountRaised:3e5,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",body:"<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>",isOpen:!0,imageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg"},R={title:"WwwFrame/Banners/AppealBannerCircular",component:c,args:r},u=(d={})=>{const a=(A,{argTypes:g})=>({props:Object.keys(g),components:{AppealBannerCircular:c},setup(){return{...r,...d}},template:`
            <div>
                <appeal-banner-circular
                    :target-amount="targetAmount"
                    :amount-raised="amountRaised"
                    :button-amounts="buttonAmounts"
                    :headline="headline"
                    :body="body"
                    :is-open="isOpen"
                    :image-url="imageUrl"
                    @toggle-banner="onToggleBanner"
                    @amount-selected="onAmountSelected"
                />
            </div>
        `,methods:{onAmountSelected(o){console.log(o)},onToggleBanner(o){console.log(o)}}});return a.args=r,a},e=u(),t=u({targetAmount:455e4});var n,s,m;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:"story()",...(m=(s=e.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};var p,i,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`story({
  targetAmount: 4550000
})`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const U=["Default","MillionGoal"];export{e as Default,t as MillionGoal,U as __namedExportsOrder,R as default};
