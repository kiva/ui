import{K as a}from"./entry-KvExpandableQuestion-B8zSi-jeM1.js";import"./entry-mdi-Dz4iKpiukw.js";import"./entry-KvExpandable-CiymQjBy2I.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-D8DnGkc65h.js";import"./entry-index-CChdZ_3Gdm.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-index-CIhg29qoqd.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},x={title:"Kv/KvExpandableQuestion",component:a,args:i},e=(o,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:a},setup(){return o},template:`
        <div class="row collapse">
            <kv-expandable-question
                :title="title"
                :content="content"
                :id="$filters.changeCase(title, 'paramCase')"
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
                :id="$filters.changeCase(title, 'paramCase')"
                class="small-12 columns"
            />
        </div>
    \`
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const f=["Default"];export{e as Default,f as __namedExportsOrder,x as default};
