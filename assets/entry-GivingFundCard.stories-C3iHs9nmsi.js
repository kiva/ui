import{a as C}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as D}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{_ as N}from"./entry-GivingFundCard-D6q2EnIvj8.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-KvButton-BdG-Dl0jtV.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-AccountStatCard-CITUODSCcD.js";import"./entry-KvLoadingText-Vx0qHvN3S0.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-useImpactStats-B-WZcFJ0ZI.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-givingFundUtils-DbBAppaSM4.js";import"./entry-useApolloQuery-Dvuff6giSC.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-lazyApolloOperation-COqpNXNIst.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-settingsUtils-DmiCd-vQln.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";const tr={title:"Portfolio/ImpactStats/GivingFundCard"},a=({deposits:m="1000.00",funds:i=[]}={})=>({id:1,givingFundParticipation:{totalAmount:m,totalCount:3},givingFunds:{totalCount:i.length,values:i}}),M=[{id:"a",currentAmountDonated:"1000.00"},{id:"b",currentAmountDonated:"25.00"}],s=({my:m,wrapperStyle:i="max-width: 568px;"}={})=>(()=>({components:{GivingFundCard:N},mixins:[C({queryResult:{data:{my:m}}}),D()],template:`<div style="${i}"><giving-fund-card /></div>`})).bind({}),p={viewport:{defaultViewport:"largeBreakpoint"}},A={viewport:{defaultViewport:"mobile2"}},r=s({my:a({funds:M})});r.parameters=p;const e=s({my:a()});e.parameters=p;const o=s({my:a({deposits:"0.00",funds:[{id:"a",currentAmountDonated:"0.00"}]})});o.parameters=p;const t=s({my:a({funds:M}),wrapperStyle:""});t.parameters=A;const n=s({my:a(),wrapperStyle:""});n.parameters=A;var d,c,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`story({
  my: lender({
    funds: ownedFunds
  })
})`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var l,y,w;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  my: lender()
})`,...(w=(y=e.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var g,f,S;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  my: lender({
    deposits: '0.00',
    funds: [{
      id: 'a',
      currentAmountDonated: '0.00'
    }]
  })
})`,...(S=(f=o.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var v,O,b;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  my: lender({
    funds: ownedFunds
  }),
  wrapperStyle: ''
})`,...(b=(O=t.parameters)==null?void 0:O.docs)==null?void 0:b.source}}};var F,_,x;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  my: lender(),
  wrapperStyle: ''
})`,...(x=(_=n.parameters)==null?void 0:_.docs)==null?void 0:x.source}}};const nr=["Owner","NonOwner","Zero","OwnerMobile","NonOwnerMobile"];export{e as NonOwner,n as NonOwnerMobile,r as Owner,t as OwnerMobile,o as Zero,nr as __namedExportsOrder,tr as default};
