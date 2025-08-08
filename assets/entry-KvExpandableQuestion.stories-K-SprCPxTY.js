import{K as o}from"./entry-KvExpandableQuestion-DzA2D7viMw.js";import"./entry-mdi-tbnfdHUa_P.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvExpandable--r0Qaerw2J.js";import"./entry-vue.esm-bundler-6I7BZrzll1.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-BlqYKufAko.js";import"./entry-KvWwwHeader-H1zV_3ei7j.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},y={title:"Kv/KvExpandableQuestion",component:o,args:i},e=(a,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:o},setup(){return a},template:`
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
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,y as default};
