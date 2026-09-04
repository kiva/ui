import{_ as P}from"./entry-RecommendLoanForGoalContainer-CwAq80632P.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-RecommendLoanForGoalHeader-DXRB2NoJXB.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-useMultiMatching-CLBeevnai4.js";import"./entry-settingsUtils-DJB3XWMHQq.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-useApolloQuery-BhW_iXEb35.js";import"./entry-vue-router-FhvgPHqR7g.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-express-checkout-lines-CS7v2wI76H.js";const H="https://www.kiva.org/img/",p=G[2],O=["12 loan goal","U.S. Entrepreneurs","2 loans completed"],j={loan:p,loanId:p.id,photoPath:H,showTags:!0,externalLinks:!0,customLoanDetails:!0,showViewLoan:!1,isVisitor:!0,showLightView:!0,basketItems:[],route:{}},ue={title:"Loan Cards/Recommend Loan For Goal Container",component:P,argTypes:{headerTitle:{control:"text"},headerDetails:{control:"object"},contentHeading:{control:"text"},expressCheckoutEnabled:{control:"boolean"},isAdding:{control:"boolean"},isInBasket:{control:"boolean"},isRedirecting:{control:"boolean"},loadedSetData:{control:"boolean"},footerProps:{control:"object"}}},e=(A={})=>{const i={headerTitle:"Goal set!",headerDetails:O,contentHeading:"Start your goal with this recommended loan",expressCheckoutEnabled:!1,isAdding:!1,isInBasket:!1,isRedirecting:!1,loadedSetData:!0,footerProps:{},...A},d=(V,{argTypes:v})=>({props:Object.keys(v),components:{RecommendLoanForGoalContainer:P},setup(){const F={...j,kvTrackFunction:()=>{}};return{args:i,contentCardProps:F}},template:`
            <div class="tw-w-full tw-bg-white" style="max-width: 700px">
                <recommend-loan-for-goal-container
                    v-bind="args"
                    :content-card-props="contentCardProps"
                />
            </div>
        `});return d.args=i,d},o=e(),t=e({expressCheckoutEnabled:!0}),r=e({isAdding:!0}),s=e({isInBasket:!0}),a=e({expressCheckoutEnabled:!0,isInBasket:!0}),n=e({expressCheckoutEnabled:!0,isInBasket:!0,isRedirecting:!0}),c=e({loadedSetData:!1});var m,l,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:"story()",...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var g,k,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true
})`,...(h=(k=t.parameters)==null?void 0:k.docs)==null?void 0:h.source}}};var C,b,x;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  isAdding: true
})`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var f,y,w;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  isInBasket: true
})`,...(w=(y=s.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var E,R,S;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true,
  isInBasket: true
})`,...(S=(R=a.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var D,L,B;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true,
  isInBasket: true,
  isRedirecting: true
})`,...(B=(L=n.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var I,T,_;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  loadedSetData: false
})`,...(_=(T=c.parameters)==null?void 0:T.docs)==null?void 0:_.source}}};const ge=["Default","ExpressCheckout","AddingToBasket","CheckoutReady","ExpressCheckoutReady","Redirecting","Loading"];export{r as AddingToBasket,s as CheckoutReady,o as Default,t as ExpressCheckout,a as ExpressCheckoutReady,c as Loading,n as Redirecting,ge as __namedExportsOrder,ue as default};
