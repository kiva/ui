import{K as a}from"./entry-KvCurrencyInput-YXr4kvMVTK.js";import{r as m,m as s,a as d,u as p}from"./entry-index-PjdmwJJ0So.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvTextInput-PtyG7zaCU-.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-mdi-DelXZw8dIC.js";import"./entry-KvMaterialIcon-D8DnGkc65h.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-attrs-_14vz2sMym.js";const C={title:"Kv/Form Elements/KvCurrencyInput",component:a},n=()=>({components:{KvCurrencyInput:a},data(){return{amount:25}},template:`
        <fieldset>
            <label class="input-label"for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
        </fieldset>
    `}),e=()=>({validations(){return{amount:{required:m,minValue:s(5),maxValue:d(1e4)}}},components:{KvCurrencyInput:a},data(){return{amount:25}},setup(){return{v$:p()}},template:`
        <fieldset>
            <label :style="{ ...(v$.$invalid && { color: 'red' })}" for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
            <ul class="validation-errors">
                <li v-if="v$.amount?.required?.$invalid">Field is required</li>
                <li v-if="v$.amount?.minValue?.$invalid || v$.amount?.maxValue?.$invalid">
                    Enter an amount of $5-$10,000
                </li>
            </ul>
        </fieldset>
    `});var t,r,o;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    KvCurrencyInput
  },
  data() {
    return {
      amount: 25
    };
  },
  template: \`
        <fieldset>
            <label class="input-label"for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
        </fieldset>
    \`
})`,...(o=(r=n.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};var u,i,l;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`() => ({
  validations() {
    return {
      amount: {
        required,
        minValue: minValue(5),
        maxValue: maxValue(10000)
      }
    };
  },
  components: {
    KvCurrencyInput
  },
  data() {
    return {
      amount: 25
    };
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  template: \`
        <fieldset>
            <label :style="{ ...(v$.$invalid && { color: 'red' })}" for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
            <ul class="validation-errors">
                <li v-if="v$.amount?.required?.$invalid">Field is required</li>
                <li v-if="v$.amount?.minValue?.$invalid || v$.amount?.maxValue?.$invalid">
                    Enter an amount of $5-$10,000
                </li>
            </ul>
        </fieldset>
    \`
})`,...(l=(i=e.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const I=["Default","WithValidation"];export{n as Default,e as WithValidation,I as __namedExportsOrder,C as default};
