import{K as a}from"./entry-KvCurrencyInput-BToaPvPd7r.js";import{u as m,m as s,a as d,r as c}from"./entry-index-1ieB9MdYsA.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-KvSecondaryNav-Bp1Uuall6y.js";import"./entry-KvTextInput-Pm5YUpay3x.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const K={title:"Kv/Form Elements/KvCurrencyInput",component:a},n=()=>({components:{KvCurrencyInput:a},data(){return{amount:25}},template:`
        <fieldset>
            <label class="input-label"for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
        </fieldset>
    `}),e=()=>({validations(){return{amount:{required:c,minValue:d(5),maxValue:s(1e4)}}},components:{KvCurrencyInput:a},data(){return{amount:25}},setup(){return{v$:m()}},template:`
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
    `});var t,r,u;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
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
})`,...(u=(r=n.parameters)==null?void 0:r.docs)==null?void 0:u.source}}};var o,l,i;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`() => ({
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
})`,...(i=(l=e.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const q=["Default","WithValidation"];export{n as Default,e as WithValidation,q as __namedExportsOrder,K as default};
