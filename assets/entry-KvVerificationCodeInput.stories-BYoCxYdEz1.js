import{K as i}from"./entry-KvVerificationCodeInput-vkGmA5CTzB.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={title:"Kv/Form Elements/KvVerificationCodeInput",component:i},e=(r,{argTypes:o})=>({props:Object.keys(o),components:{KvVerificationCodeInput:i},args:{maxlength:4,disabled:!1},data(){return{verificationCode:""}},template:`
        <div>
            <label for="my_default_input">Enter your verification code</label>
            <kv-verification-code-input
                id="my_default_input"
                :maxlength="maxlength"
                :disabled="disabled"
                v-model="verificationCode"
            />
        </div>
    `});var n,t,a;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvVerificationCodeInput
  },
  args: {
    maxlength: 4,
    disabled: false
  },
  data() {
    return {
      verificationCode: ''
    };
  },
  template: \`
        <div>
            <label for="my_default_input">Enter your verification code</label>
            <kv-verification-code-input
                id="my_default_input"
                :maxlength="maxlength"
                :disabled="disabled"
                v-model="verificationCode"
            />
        </div>
    \`
})`,...(a=(t=e.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const p=["Default"];export{e as Default,p as __namedExportsOrder,c as default};
