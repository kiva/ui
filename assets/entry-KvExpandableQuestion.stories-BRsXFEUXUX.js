import{K as o}from"./entry-KvExpandableQuestion-CcQfO6yVtS.js";import"./entry-KvMaterialIcon-BdbWoAcYP2.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-BLG9j3cwXD.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvExpandable-MAyWVe8SfS.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-numeral-CmvrP3KSIW.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},x={title:"Kv/KvExpandableQuestion",component:o,args:i},e=(a,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:o},setup(){return a},template:`
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
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const f=["Default"];export{e as Default,f as __namedExportsOrder,x as default};
