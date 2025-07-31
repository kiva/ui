import{K as a}from"./entry-KvCurrencyInput-DftJeMnFh1.js";import{u as m,m as s,a as d,r as p}from"./entry-index-CWVkADibIp.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-KvSecondaryNav-DV-NXuJ8zv.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-KvTextInput-CxwTnqWBfE.js";import"./entry-mdi-BWfL41h-RO.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvMaterialIcon-9bv_WqKuLB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const k={title:"Kv/Form Elements/KvCurrencyInput",component:a},n=()=>({components:{KvCurrencyInput:a},data(){return{amount:25}},template:`
        <fieldset>
            <label class="input-label"for="amount">
                Amount
            </label>
            <kv-currency-input id="amount" v-model="amount"/>
        </fieldset>
    `}),e=()=>({validations(){return{amount:{required:p,minValue:d(5),maxValue:s(1e4)}}},components:{KvCurrencyInput:a},data(){return{amount:25}},setup(){return{v$:m()}},template:`
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
})`,...(l=(u=e.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const A=["Default","WithValidation"];export{n as Default,e as WithValidation,A as __namedExportsOrder,k as default};
