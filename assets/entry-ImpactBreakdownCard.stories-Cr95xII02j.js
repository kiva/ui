import{a as K}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as T}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{i as o,a as U,s as X,b as Y}from"./entry-impact-stats-data-mock-BF3-RkyAqe.js";import{_ as Z}from"./entry-ImpactBreakdownCard-BnRtwJxVpd.js";import"./entry-country-facets-data-mock-l9X9_af47-.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-mdi-CqWyar1Kn0.js";import"./entry-KvButton-DhnDSkEAjx.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLightbox-BfvSJnIv_C.js";import"./entry-printing-DwWJHhrrq-.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-KvLoadingText-Vx0qHvN3S0.js";import"./entry-KvPieChartV2-Bz7Ievq5E_.js";import"./entry-tokens-Cdn1heMTVo.js";import"./entry-KvTextLink-DU3XpJzEwk.js";import"./entry-useBreakpoints-tjLFE4eqUd.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-ImpactSectionCard-BGhcPdlz5B.js";import"./entry-KvCardFrame-BICJU2Bz9M.js";import"./entry-KvThemeProvider-DWwIJ-sF5X.js";import"./entry-kivaColors-BJyFMChe18.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-settingsUtils-DmiCd-vQln.js";import"./entry-get-URTN0AnQsa.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-COmIkRYU2t.js";import"./entry-useApolloQuery-Dvuff6giSC.js";import"./entry-vue-router-x2O2Zij-Un.js";import"./entry-lazyApolloOperation-COqpNXNIst.js";import"./entry-observerUtils-Cg16I4RRYc.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Wt={title:"Portfolio/ImpactStats/ImpactBreakdownCard"},t=({type:e="sector",my:a,loading:v=!1}={})=>{const{apollo:L}=K({queryResult:{data:{my:a,...U}},loading:v}).provide;return(()=>({components:{ImpactBreakdownCard:Z},mixins:[T()],provide:{apollo:v?{...L,readQuery:()=>null}:L},template:`<div style="max-width: 757px;"><impact-breakdown-card type="${e}" /></div>`})).bind({})},r={viewport:{defaultViewport:"largeBreakpoint"}},tt=o({sectorLoans:X.filter(e=>e!=="Entertainment").map((e,a)=>[e,15-a])}),rt=o({activityLoans:Y.filter(e=>e!=="Weaving").reverse().map((e,a)=>[e,15-a])}),J=o({sectorLoans:[],activityLoans:[]}),s=t({my:o()});s.parameters=r;const i=t({my:tt});i.parameters=r;const m=t({my:J});m.parameters=r;const p=t({my:o(),loading:!0});p.parameters=r;const c=t({my:null});c.parameters=r;const n=t({type:"activity",my:o()});n.parameters=r;const y=t({type:"activity",my:rt});y.parameters=r;const d=t({type:"activity",my:J});d.parameters=r;const u=t({type:"activity",my:o(),loading:!0});u.parameters=r;const l=t({type:"activity",my:null});l.parameters=r;var g,S,A;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  my: impactStatsLender()
})`,...(A=(S=s.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var f,E,h;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  my: everythingLent
})`,...(h=(E=i.parameters)==null?void 0:E.docs)==null?void 0:h.source}}};var _,k,w;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  my: noLoans
})`,...(w=(k=m.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var x,N,P;p.parameters={...p.parameters,docs:{...(x=p.parameters)==null?void 0:x.docs,source:{originalSource:`story({
  my: impactStatsLender(),
  loading: true
})`,...(P=(N=p.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var b,B,I;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`story({
  my: null
})`,...(I=(B=c.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var C,D,M;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  type: 'activity',
  my: impactStatsLender()
})`,...(M=(D=n.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};var q,O,Q;y.parameters={...y.parameters,docs:{...(q=y.parameters)==null?void 0:q.docs,source:{originalSource:`story({
  type: 'activity',
  my: everythingLentActivities
})`,...(Q=(O=y.parameters)==null?void 0:O.docs)==null?void 0:Q.source}}};var R,V,W;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`story({
  type: 'activity',
  my: noLoans
})`,...(W=(V=d.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};var $,j,z;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`story({
  type: 'activity',
  my: impactStatsLender(),
  loading: true
})`,...(z=(j=u.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var F,G,H;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  type: 'activity',
  my: null
})`,...(H=(G=l.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};const $t=["Populated","EverythingLent","NoLoans","Loading","Error","ActivityPopulated","ActivityEverythingLent","ActivityNoLoans","ActivityLoading","ActivityError"];export{l as ActivityError,y as ActivityEverythingLent,u as ActivityLoading,d as ActivityNoLoans,n as ActivityPopulated,c as Error,i as EverythingLent,p as Loading,m as NoLoans,s as Populated,$t as __namedExportsOrder,Wt as default};
