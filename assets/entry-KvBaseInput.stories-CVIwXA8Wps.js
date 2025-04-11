import{K as o}from"./entry-KvBaseInput-D4TRh5y6Ew.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-BLG9j3cwXD.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvCheckbox-Nu6kn2Hw_h.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-numeral-CmvrP3KSIW.js";import"./entry-KvTextInput-CgEEIf_9Ri.js";import"./entry-KvMaterialIcon-BdbWoAcYP2.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const p={vuelidateObject:{validationName:!1,$error:!0,$params:{validationName:{}}}},h={title:"Kv/Form Elements/KvBaseInput",component:o},e=()=>({components:{KvBaseInput:o},data(){return{...p,value:""}},template:`
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
})`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const k=["Default"];export{e as Default,k as __namedExportsOrder,h as default};
