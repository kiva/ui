import{K as o}from"./entry-KvExpandableQuestion-Cu0fBmlDNy.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvExpandable-BBEGRXAsk_.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const i={title:"Can I cancel anytime?",content:'<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'},C={title:"Kv/KvExpandableQuestion",component:o,args:i},t=(a,{argTypes:r})=>({props:Object.keys(r),components:{KvExpandableQuestion:o},setup(){return a},template:`
        <div class="row collapse">
            <kv-expandable-question
                :title="title"
                :content="content"
                :id="$filters.changeCase(title, 'kebabCase')"
                class="small-12 columns"
            />
        </div>
    `});var e,n,s;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`(args, {
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
})`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const E=["Default"];export{t as Default,E as __namedExportsOrder,C as default};
