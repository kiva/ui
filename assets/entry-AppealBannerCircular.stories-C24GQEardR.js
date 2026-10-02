import{A as c}from"./entry-AppealBannerCircular-CkcfGGWeRF.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-mdi-BJsnkeP_LR.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvContentfulImg-D-LHiU57et.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-KvPageContainer-8Ce8pJZ6Ss.js";import"./entry-KvProgressCircle-8R1WpjpRVF.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const r={targetAmount:45e4,amountRaised:3e5,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",body:"<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>",isOpen:!0,imageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg"},R={title:"WwwFrame/Banners/AppealBannerCircular",component:c,args:r},u=(d={})=>{const a=(A,{argTypes:g})=>({props:Object.keys(g),components:{AppealBannerCircular:c},setup(){return{...r,...d}},template:`
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
