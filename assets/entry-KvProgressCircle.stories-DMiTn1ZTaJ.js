import{K as o}from"./entry-KvProgressCircle-CXpSZPgwHT.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const n={value:10,strokeWidth:8,showNumber:!1,arcScale:1,rotate:0},b={title:"Kv/KvProgressCircle",component:o,args:n,argTypes:{value:{control:"range",options:{min:0,max:100,step:1}}}},e=(a,{argTypes:t})=>({props:Object.keys(t),components:{KvProgressCircle:o},setup(){return{...n,...a}},template:`
        <kv-progress-circle
            :value="value"
            :stroke-width="strokeWidth"
            :show-number="showNumber"
            :arc-scale="arcScale"
            :rotate="rotate"
            style="width: 200px;"
        />
    `}),s=(a,{argTypes:t})=>({props:Object.keys(t),components:{KvProgressCircle:o},setup(){return n},template:`
        <kv-progress-circle
            :value="value"
            :stroke-width="strokeWidth"
            :show-number="showNumber"
            :arc-scale="arcScale"
            :rotate="rotate"
            style="
                --kv-progress-circle-foreground-color: purple;
                --kv-progress-circle-background-color: orange;
                width: 4rem;
            "
        />
    `}),r=e.bind({});r.otherArgs={arcScale:.8,rotate:36};var c,p,l;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressCircle
  },
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <kv-progress-circle
            :value="value"
            :stroke-width="strokeWidth"
            :show-number="showNumber"
            :arc-scale="arcScale"
            :rotate="rotate"
            style="width: 200px;"
        />
    \`
})`,...(l=(p=e.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var u,i,m;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressCircle
  },
  setup() {
    return args;
  },
  template: \`
        <kv-progress-circle
            :value="value"
            :stroke-width="strokeWidth"
            :show-number="showNumber"
            :arc-scale="arcScale"
            :rotate="rotate"
            style="
                --kv-progress-circle-foreground-color: purple;
                --kv-progress-circle-background-color: orange;
                width: 4rem;
            "
        />
    \`
})`,...(m=(i=s.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var g,d,h;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvProgressCircle
  },
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <kv-progress-circle
            :value="value"
            :stroke-width="strokeWidth"
            :show-number="showNumber"
            :arc-scale="arcScale"
            :rotate="rotate"
            style="width: 200px;"
        />
    \`
})`,...(h=(d=r.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};const y=["Default","Styled","CShape"];export{r as CShape,e as Default,s as Styled,y as __namedExportsOrder,b as default};
