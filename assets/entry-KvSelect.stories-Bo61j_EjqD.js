import{K as o}from"./entry-KvSelect-TK-QxdW55y.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const d={title:"Kv/Form Elements/KvSelect",component:o},e=()=>({components:{KvSelect:o},data:()=>({myCoolModel:"test3"}),template:`
        <kv-select v-model="myCoolModel">
            <option value="test">Test</option>
            <option value="test2">Test2</option>
            <option value="test3">Test3</option>
        </kv-select>
    `}),t=()=>({components:{KvSelect:o},data:()=>({myCoolModel:"test3"}),template:`
        <kv-select disabled v-model="myCoolModel">
            <option value="test">Test</option>
            <option value="test2">Test2</option>
            <option value="test3">Test3</option>
        </kv-select>
    `});var s,n,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`() => ({
  components: {
    KvSelect
  },
  data: () => ({
    myCoolModel: 'test3'
  }),
  template: \`
        <kv-select v-model="myCoolModel">
            <option value="test">Test</option>
            <option value="test2">Test2</option>
            <option value="test3">Test3</option>
        </kv-select>
    \`
})`,...(l=(n=e.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};var a,p,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`() => ({
  components: {
    KvSelect
  },
  data: () => ({
    myCoolModel: 'test3'
  }),
  template: \`
        <kv-select disabled v-model="myCoolModel">
            <option value="test">Test</option>
            <option value="test2">Test2</option>
            <option value="test3">Test3</option>
        </kv-select>
    \`
})`,...(i=(p=t.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};const v=["Default","Disabled"];export{e as Default,t as Disabled,v as __namedExportsOrder,d as default};
