import{a as k}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as C}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{_ as B}from"./entry-AccountOverviewCard-CBxs8-rWAm.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-KvButton-BdG-Dl0jtV.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-AccountStatCard-CITUODSCcD.js";import"./entry-KvLoadingText-Vx0qHvN3S0.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-useImpactStats-B-WZcFJ0ZI.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-givingFundUtils-DbBAppaSM4.js";import"./entry-useApolloQuery-Dvuff6giSC.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-lazyApolloOperation-COqpNXNIst.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-settingsUtils-DmiCd-vQln.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";const ar={title:"Portfolio/ImpactStats/AccountOverviewCard"},s=({balance:m="847.23",amountOutstanding:p="3240.00"}={})=>({id:1,userAccount:{id:1,firstName:"James",balance:m,promoBalance:"0.00"},userStats:{amount_outstanding:p}}),n=({my:m,loading:p=!1,wrapperStyle:Z="max-width: 568px;"}={})=>{const{apollo:c}=k({queryResult:{data:{my:m}},loading:p}).provide;return(()=>({components:{AccountOverviewCard:B},mixins:[C()],provide:{apollo:p?{...c,readQuery:()=>null}:c},template:`<div style="${Z}"><account-overview-card /></div>`})).bind({})},i={viewport:{defaultViewport:"largeBreakpoint"}},A={viewport:{defaultViewport:"mobile2"}},r=n({my:s()});r.parameters=i;const e=n({my:s({balance:"0.00",amountOutstanding:"0.00"})});e.parameters=i;const o=n({my:s(),loading:!0});o.parameters=i;const t=n({my:s(),wrapperStyle:""});t.parameters=A;const a=n({my:s({balance:"0.00",amountOutstanding:"0.00"}),wrapperStyle:""});a.parameters=A;var d,l,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`story({
  my: lender()
})`,...(u=(l=r.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var y,g,v;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  my: lender({
    balance: '0.00',
    amountOutstanding: '0.00'
  })
})`,...(v=(g=e.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var S,w,b;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`story({
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
})`,...(P=(M=a.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const sr=["Populated","Zero","Loading","PopulatedMobile","ZeroMobile"];export{o as Loading,r as Populated,t as PopulatedMobile,e as Zero,a as ZeroMobile,sr as __namedExportsOrder,ar as default};
