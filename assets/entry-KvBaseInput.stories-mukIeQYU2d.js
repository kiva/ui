import{K as o}from"./entry-KvBaseInput-5fudHqQuiY.js";import"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import"./entry-KvWwwHeader-CVdIzOPj6Q.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-KvCheckbox-DOGFVMmKkd.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-mdi-BJHOrBfjV3.js";import"./entry-KvMaterialIcon-DcajXwg-0j.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvTextInput-DOWiWB5Pob.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const p={vuelidateObject:{validationName:!1,$error:!0,$params:{validationName:{}}}},k={title:"Kv/Form Elements/KvBaseInput",component:o},e=()=>({components:{KvBaseInput:o},data(){return{...p,value:""}},template:`
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
    `,methods:{onChange(i){console.log(i)}}});var t,n,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
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
})`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,k as default};
