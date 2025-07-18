import{K as o}from"./entry-KvBaseInput-D1I73vgCWy.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-KvSecondaryNav-CSFqCa1lom.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvCheckbox-CPOTwk-EHs.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-KvTextInput-C5HjM7Sv5l.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const s={vuelidateObject:{validationName:!1,$error:!0,$params:{validationName:{}}}},f={title:"Kv/Form Elements/KvBaseInput",component:o},e=()=>({components:{KvBaseInput:o},data(){return{...s,value:""}},template:`
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
})`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};const h=["Default"];export{e as Default,h as __namedExportsOrder,f as default};
