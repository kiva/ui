import{_}from"./entry-RecommendLoanForGoalContainer-B-lefMmNrF.js";import{l as G}from"./entry-loan-data-mock-B1RgYuoN0n.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-RecommendLoanForGoalHeader-BgDdTT9A6j.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-useMultiMatching-XbEGhbvOiB.js";import"./entry-settingsUtils-CVQrt31Ifm.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-vue-router-BRJ8td2miO.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-express-checkout-lines-C9HhaO3zQ8.js";const H="https://www.kiva.org/img/",p=G[2],O=["12 loan goal","U.S. Entrepreneurs","2 loans completed"],j={loan:p,loanId:p.id,photoPath:H,showTags:!0,externalLinks:!0,customLoanDetails:!0,showViewLoan:!1,isVisitor:!0,showLightView:!0,basketItems:[],route:{}},le={title:"Loan Cards/Recommend Loan For Goal Container",component:_,argTypes:{headerTitle:{control:"text"},headerDetails:{control:"object"},contentHeading:{control:"text"},expressCheckoutEnabled:{control:"boolean"},isAdding:{control:"boolean"},isInBasket:{control:"boolean"},isRedirecting:{control:"boolean"},loadedSetData:{control:"boolean"},footerProps:{control:"object"}}},e=(A={})=>{const i={headerTitle:"Goal set!",headerDetails:O,contentHeading:"Start your goal with this recommended loan",expressCheckoutEnabled:!1,isAdding:!1,isInBasket:!1,isRedirecting:!1,loadedSetData:!0,footerProps:{},...A},d=(V,{argTypes:v})=>({props:Object.keys(v),components:{RecommendLoanForGoalContainer:_},setup(){const F={...j,kvTrackFunction:()=>{}};return{args:i,contentCardProps:F}},template:`
            <div class="tw-w-full tw-bg-white" style="max-width: 700px">
                <recommend-loan-for-goal-container
                    v-bind="args"
                    :content-card-props="contentCardProps"
                />
            </div>
        `});return d.args=i,d},o=e(),r=e({expressCheckoutEnabled:!0}),t=e({isAdding:!0}),s=e({isInBasket:!0}),a=e({expressCheckoutEnabled:!0,isInBasket:!0}),n=e({expressCheckoutEnabled:!0,isInBasket:!0,isRedirecting:!0}),c=e({loadedSetData:!1});var m,l,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:"story()",...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var g,k,h;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true
})`,...(h=(k=r.parameters)==null?void 0:k.docs)==null?void 0:h.source}}};var C,b,x;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  isAdding: true
})`,...(x=(b=t.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var f,y,w;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  isInBasket: true
})`,...(w=(y=s.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var E,R,S;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true,
  isInBasket: true
})`,...(S=(R=a.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var L,B,D;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  expressCheckoutEnabled: true,
  isInBasket: true,
  isRedirecting: true
})`,...(D=(B=n.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var I,T,P;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  loadedSetData: false
})`,...(P=(T=c.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};const ue=["Default","ExpressCheckout","AddingToBasket","CheckoutReady","ExpressCheckoutReady","Redirecting","Loading"];export{t as AddingToBasket,s as CheckoutReady,o as Default,r as ExpressCheckout,a as ExpressCheckoutReady,c as Loading,n as Redirecting,ue as __namedExportsOrder,le as default};
