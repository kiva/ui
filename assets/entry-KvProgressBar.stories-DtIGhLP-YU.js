import{K as a}from"./entry-KvProgressBar-CCdqto2DlY.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const o={value:"20",max:"100"},b={title:"Kv/KvProgressBar",component:a,args:o},r=(l,{argTypes:s})=>({props:Object.keys(s),components:{KvProgressBar:a},setup(){return o},template:`
        <kv-progress-bar
            :value="value"
            :max="max"
         />
    `}),e=(l,{argTypes:s})=>({props:Object.keys(s),components:{KvProgressBar:a},setup(){return o},template:`
        <kv-progress-bar
            :value="value"
            :max="max"
            style="
                --kv-progress-bar-foreground-color: purple;
                --kv-progress-bar-background-color: orange;
                width: 50%;
            "
        />
    `});var n,t,p;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressBar
  },
  setup() {
    return args;
  },
  template: \`
        <kv-progress-bar
            :value="value"
            :max="max"
         />
    \`
})`,...(p=(t=r.parameters)==null?void 0:t.docs)==null?void 0:p.source}}};var c,u,m;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressBar
  },
  setup() {
    return args;
  },
  template: \`
        <kv-progress-bar
            :value="value"
            :max="max"
            style="
                --kv-progress-bar-foreground-color: purple;
                --kv-progress-bar-background-color: orange;
                width: 50%;
            "
        />
    \`
})`,...(m=(u=e.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};const k=["Default","Styled"];export{r as Default,e as Styled,k as __namedExportsOrder,b as default};
