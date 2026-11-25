import{K as a}from"./entry-KvExpandableQuestion-DmCUGpxBIt.js";import"./entry-mdi-CqWyar1Kn0.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-KvExpandable-Cy_CYsgWKK.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},v={title:"Kv/KvExpandableQuestion",component:a,args:i},e=(o,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:a},setup(){return o},template:`
        <div class="row collapse">
            <kv-expandable-question
                :title="title"
                :content="content"
                :id="$filters.changeCase(title, 'kebabCase')"
                class="small-12 columns"
            />
        </div>
    `});var t,n,s;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvExpandableQuestion
  },
  setup() {
    return args;
  },
  template: \`
        <div class="row collapse">
            <kv-expandable-question
                :title="title"
                :content="content"
                :id="$filters.changeCase(title, 'kebabCase')"
                class="small-12 columns"
            />
        </div>
    \`
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,v as default};
