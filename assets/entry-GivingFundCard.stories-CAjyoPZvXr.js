import{a as v}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as w}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{_}from"./entry-GivingFundCard-Gxv-FzRPKT.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-KvButton-DhnDSkEAjx.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-AccountStatCard-CITUODSCcD.js";import"./entry-KvLoadingText-Vx0qHvN3S0.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-useImpactStats-B-WZcFJ0ZI.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-givingFundUtils-DbBAppaSM4.js";import"./entry-useApolloQuery-Dvuff6giSC.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-lazyApolloOperation-COqpNXNIst.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-settingsUtils-DmiCd-vQln.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";const Q={title:"Portfolio/ImpactStats/GivingFundCard"},i=({deposits:e="1000.00",funds:n=[]}={})=>({id:1,givingFundParticipation:{totalAmount:e,totalCount:3},givingFunds:{totalCount:n.length,values:n}}),x=[{id:"a",currentAmountDonated:"1000.00"},{id:"b",currentAmountDonated:"25.00"}],a=({my:e}={})=>(()=>({components:{GivingFundCard:_},mixins:[v({queryResult:{data:{my:e}}}),w()],template:'<div style="max-width: 568px;"><giving-fund-card /></div>'})).bind({}),s={viewport:{defaultViewport:"largeBreakpoint"}},r=a({my:i({funds:x})});r.parameters=s;const t=a({my:i()});t.parameters=s;const o=a({my:i({deposits:"0.00",funds:[{id:"a",currentAmountDonated:"0.00"}]})});o.parameters=s;var m,p,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  my: lender({
    funds: ownedFunds
  })
})`,...(d=(p=r.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var c,u,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`story({
  my: lender()
})`,...(l=(u=t.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var g,y,f;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  my: lender({
    deposits: '0.00',
    funds: [{
      id: 'a',
      currentAmountDonated: '0.00'
    }]
  })
})`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const T=["Owner","NonOwner","Zero"];export{t as NonOwner,r as Owner,o as Zero,T as __namedExportsOrder,Q as default};
