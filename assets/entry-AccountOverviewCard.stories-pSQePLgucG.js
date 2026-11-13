import{a as k}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as C}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{_ as B}from"./entry-AccountOverviewCard-jhgraVefGX.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-useImpactStats-DFqRzQyXQn.js";import"./entry-KvLoadingText-CxmXdfCoIk.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-givingFundUtils-DbBAppaSM4.js";import"./entry-useApolloQuery-DzwiBjTbWW.js";import"./entry-vue-router-Zhl8QJ3lVg.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";const W={title:"Portfolio/ImpactStats/AccountOverviewCard"},s=({balance:m="847.23",amountOutstanding:p="3240.00"}={})=>({id:1,userAccount:{id:1,firstName:"James",balance:m,promoBalance:"0.00"},userStats:{amount_outstanding:p}}),n=({my:m,loading:p=!1,wrapperStyle:Z="max-width: 568px;"}={})=>{const{apollo:c}=k({queryResult:{data:{my:m}},loading:p}).provide;return(()=>({components:{AccountOverviewCard:B},mixins:[C()],provide:{apollo:p?{...c,readQuery:()=>null}:c},template:`<div style="${Z}"><account-overview-card /></div>`})).bind({})},i={viewport:{defaultViewport:"largeBreakpoint"}},A={viewport:{defaultViewport:"mobile2"}},e=n({my:s()});e.parameters=i;const r=n({my:s({balance:"0.00",amountOutstanding:"0.00"})});r.parameters=i;const o=n({my:s(),loading:!0});o.parameters=i;const t=n({my:s(),wrapperStyle:""});t.parameters=A;const a=n({my:s({balance:"0.00",amountOutstanding:"0.00"}),wrapperStyle:""});a.parameters=A;var d,l,u;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`story({
  my: lender()
})`,...(u=(l=e.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var y,g,v;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  my: lender({
    balance: '0.00',
    amountOutstanding: '0.00'
  })
})`,...(v=(g=r.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var S,w,b;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`story({
  my: lender(),
  loading: true
})`,...(b=(w=o.parameters)==null?void 0:w.docs)==null?void 0:b.source}}};var f,_,O;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  my: lender(),
  wrapperStyle: ''
})`,...(O=(_=t.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var x,M,P;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`story({
  my: lender({
    balance: '0.00',
    amountOutstanding: '0.00'
  }),
  wrapperStyle: ''
})`,...(P=(M=a.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const X=["Populated","Zero","Loading","PopulatedMobile","ZeroMobile"];export{o as Loading,e as Populated,t as PopulatedMobile,r as Zero,a as ZeroMobile,X as __namedExportsOrder,W as default};
