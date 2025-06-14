import{K as x}from"./entry-KvCheckboxList-SJMyYW1ztK.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-KvAtbModal-DhF29XDIKL.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvCheckbox-DorFtfTe7Y.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const L={title:"Kv/Form Elements/KvCheckboxList",component:x},e=[...Array(4)].map((s,c)=>({value:`${c}`,title:`Option ${c}`})),r={args:{items:e}},t={args:{items:e,showSelectAll:!0}},a={args:{items:e,selectedValues:e.slice(0,2).map(s=>s.value)}},o={args:{items:e.map(s=>({...s,disabled:!0}))}};var m,i,l;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items
  }
}`,...(l=(i=r.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};var n,p,u;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    items,
    showSelectAll: true
  }
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var d,g,S;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    items,
    selectedValues: items.slice(0, 2).map(i => i.value)
  }
}`,...(S=(g=a.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var b,h,v;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: items.map(i => ({
      ...i,
      disabled: true
    }))
  }
}`,...(v=(h=o.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const E=["Default","ShowSelectAll","SelectedValues","Disabled"];export{r as Default,o as Disabled,a as SelectedValues,t as ShowSelectAll,E as __namedExportsOrder,L as default};
