import{K as x}from"./entry-KvCheckboxList-cgjQNDBb5t.js";import"./entry-KvCheckbox-D5qYk9Nl28.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-chunk-3HK4G4NT-BNowqM5Bqg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const _={title:"Kv/Form Elements/KvCheckboxList",component:x},e=[...Array(4)].map((s,c)=>({value:`${c}`,title:`Option ${c}`})),r={args:{items:e}},a={args:{items:e,showSelectAll:!0}},t={args:{items:e,selectedValues:e.slice(0,2).map(s=>s.value)}},o={args:{items:e.map(s=>({...s,disabled:!0}))}};var m,l,i;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items
  }
}`,...(i=(l=r.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var n,p,u;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    items,
    showSelectAll: true
  }
}`,...(u=(p=a.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var d,g,S;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    items,
    selectedValues: items.slice(0, 2).map(i => i.value)
  }
}`,...(S=(g=t.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var b,h,v;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: items.map(i => ({
      ...i,
      disabled: true
    }))
  }
}`,...(v=(h=o.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const k=["Default","ShowSelectAll","SelectedValues","Disabled"];export{r as Default,o as Disabled,t as SelectedValues,a as ShowSelectAll,k as __namedExportsOrder,_ as default};
