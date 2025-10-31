import{K as s}from"./entry-KvSettingsCard-DETGV9-s7u.js";import"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const r={disabled:!1,title:"Settings Card Title",cardContent:"This is the content of the settings card. Insert anything here. The card can accommodate very tall or short content. The card should be used on a page that does not have a white background."},p={title:"Kv/KvSettingsCard",component:s,parameters:{backgrounds:{default:"kiva-bg-lightgray"}},args:r},t=(c,{argTypes:o})=>({components:{KvSettingsCard:s},props:Object.keys(o),setup(){return r},template:`
        <kv-settings-card class="column large-8" :title="title" :disabled="disabled">
            <template #content>
                <p>{{cardContent}}</p>
            </template>
        </kv-settings-card>
    `});var e,a,n;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  components: {
    KvSettingsCard
  },
  props: Object.keys(argTypes),
  setup() {
    return args;
  },
  template: \`
        <kv-settings-card class="column large-8" :title="title" :disabled="disabled">
            <template #content>
                <p>{{cardContent}}</p>
            </template>
        </kv-settings-card>
    \`
})`,...(n=(a=t.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const g=["Default"];export{t as Default,g as __namedExportsOrder,p as default};
