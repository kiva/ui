import{K as o}from"./entry-KvBaseInput-DzvUUbWvS0.js";import"./entry-KvCheckbox-D5qYk9Nl28.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-chunk-3HK4G4NT-BNowqM5Bqg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTextInput-ejHkSbTFTu.js";import"./entry-KvMaterialIcon-YL3bYtTma_.js";const i={vuelidateObject:{validationName:!1,$error:!0,$params:{validationName:{}}}},b={title:"Kv/Form Elements/KvBaseInput",component:o},e=()=>({components:{KvBaseInput:o},data(){return{...i,value:""}},template:`
        <fieldset>
            <legend>Using type=text</legend>
            <kv-base-input
                type="text"
                name="baseInput"
                :validation="{}"
                v-model="value"
            >
                Base input
            </kv-base-input>
            <kv-base-input
                type="text"
                name="baseInputError"
                :validation="vuelidateObject"
                v-model="value"
            >
                Base input with error

                <template #validationName>
                    There is a problem
                </template>
            </kv-base-input>
        </fieldset>
    `,methods:{onChange(s){console.log(s)}}});var t,n,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    KvBaseInput
  },
  data() {
    return {
      ...commonData,
      value: ''
    };
  },
  template: \`
        <fieldset>
            <legend>Using type=text</legend>
            <kv-base-input
                type="text"
                name="baseInput"
                :validation="{}"
                v-model="value"
            >
                Base input
            </kv-base-input>
            <kv-base-input
                type="text"
                name="baseInputError"
                :validation="vuelidateObject"
                v-model="value"
            >
                Base input with error

                <template #validationName>
                    There is a problem
                </template>
            </kv-base-input>
        </fieldset>
    \`,
  methods: {
    onChange(val) {
      console.log(val);
    }
  }
})`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,b as default};
