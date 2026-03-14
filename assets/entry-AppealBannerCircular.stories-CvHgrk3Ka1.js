import{A as c}from"./entry-AppealBannerCircular-4oiIzdQTF1.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-vue.esm-bundler-B8AARAaDW0.js";import"./entry-KvMaterialIcon-CFFX08EKse.js";import"./entry-KvWwwHeader-Pg76_XcPb_.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-CS01RnGux4.js";import"./entry-KvLoadingSpinner-DrgdGXZpi7.js";import"./entry-KvContentfulImg-DvNbJ5ehK4.js";import"./entry-KvPageContainer-CMXRn-F1jc.js";import"./entry-KvProgressCircle-D_cHnQrj2I.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const r={targetAmount:45e4,amountRaised:3e5,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",body:"<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>",isOpen:!0,imageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg"},j={title:"WwwFrame/Banners/AppealBannerCircular",component:c,args:r},u=(d={})=>{const a=(A,{argTypes:g})=>({props:Object.keys(g),components:{AppealBannerCircular:c},setup(){return{...r,...d}},template:`
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
})`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const w=["Default","MillionGoal"];export{e as Default,t as MillionGoal,w as __namedExportsOrder,j as default};
