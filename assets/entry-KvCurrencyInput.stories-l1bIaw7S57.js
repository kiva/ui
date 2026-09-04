import{K as t}from"./entry-KvCurrencyInput-DLhsbrEXx9.js";import{u as m,r as s,m as d,a as p}from"./entry-index-CCiTFjJQAw.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const A={title:"Kv/Form Elements/KvCurrencyInput",component:t},n=()=>({components:{KvCurrencyInput:t},data(){return{amount:25}},template:`
        <fieldset>
            <label class="input-label"for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
        </fieldset>
    `}),e=()=>({validations(){return{amount:{required:s,minValue:p(5),maxValue:d(1e4)}}},components:{KvCurrencyInput:t},data(){return{amount:25}},setup(){return{v$:m()}},template:`
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
    `});var a,r,o;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`() => ({
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
})`,...(o=(r=n.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};var i,u,l;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`() => ({
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
})`,...(l=(u=e.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const E=["Default","WithValidation"];export{n as Default,e as WithValidation,E as __namedExportsOrder,A as default};
