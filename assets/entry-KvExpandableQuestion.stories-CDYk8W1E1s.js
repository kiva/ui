import{K as a}from"./entry-KvExpandableQuestion-Cuifi2xaBY.js";import"./entry-KvSecondaryNav-Bp1Uuall6y.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvExpandable-BUT2NaFkxa.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},v={title:"Kv/KvExpandableQuestion",component:a,args:i},e=(o,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:a},setup(){return o},template:`
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
