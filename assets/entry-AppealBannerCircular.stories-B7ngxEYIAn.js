import{A as c}from"./entry-AppealBannerCircular-Dsl2aBNlnz.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-mdi-tbnfdHUa_P.js";import"./entry-KvProgressCircle-CSs3_pxl8F.js";import"./entry-vue.esm-bundler-6I7BZrzll1.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-BlqYKufAko.js";import"./entry-KvWwwHeader-H1zV_3ei7j.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-7qbgu1jWef.js";import"./entry-KvLoadingSpinner-DzbjPRg2yX.js";import"./entry-KvContentfulImg-VIg00rM53B.js";import"./entry-KvPageContainer-D-BGwA23PT.js";const r={targetAmount:45e4,amountRaised:3e5,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",body:"<p>Your support has been essential this year. Donate today to keep Kiva possible.</p>",isOpen:!0,imageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/6ymAUx6RA4sVnBgQ2lkJ7H/1fcebdc57efc014ab1726c572ea04530/Frame__export_this__.svg"},j={title:"WwwFrame/Banners/AppealBannerCircular",component:c,args:r},u=(d={})=>{const a=(A,{argTypes:g})=>({props:Object.keys(g),components:{AppealBannerCircular:c},setup(){return{...r,...d}},template:`
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
