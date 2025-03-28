import{K as o}from"./entry-KvExpandableQuestion-DZ9Cqa9Q_-.js";import"./entry-KvMaterialIcon-9RufmfqN3U.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-ac7XPc0PbW.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvExpandable-MAyWVe8SfS.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-index-CChdZ_3Gdm.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-index-CIhg29qoqd.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},y={title:"Kv/KvExpandableQuestion",component:o,args:i},e=(a,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:o},setup(){return a},template:`
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
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const K=["Default"];export{e as Default,K as __namedExportsOrder,y as default};
