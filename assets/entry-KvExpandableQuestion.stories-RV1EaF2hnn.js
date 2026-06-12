import{K as o}from"./entry-KvExpandableQuestion-DX2K7SDpdt.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvExpandable-B4x8XFNkNk.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},k={title:"Kv/KvExpandableQuestion",component:o,args:i},e=(a,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:o},setup(){return a},template:`
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
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const K=["Default"];export{e as Default,K as __namedExportsOrder,k as default};
