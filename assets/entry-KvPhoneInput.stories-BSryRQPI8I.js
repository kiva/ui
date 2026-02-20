import{K as e}from"./entry-KvPhoneInput-BMckX5JcS9.js";import"./entry-index-CQOfz2v5TU.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvTextInput-CnVgGp-sYq.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-KvFlag-CMxNRMzdLr.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const w={title:"Kv/Form Elements/KvPhoneInput",component:e},t=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:"828-479-5482"}},template:`
        <div>
            <label for="my_default_input">Enter your phone number</label>
            <kv-phone-input
                id="my_default_input"
                v-model="myCoolPhoneNumber"
            />
        </div>
    `}),a=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:"828-479-5482"}},template:`
        <div>
            <label for="events_input">Enter your phone number</label>
            <kv-phone-input
                id="events_input"
                v-model="myCoolPhoneNumber"
                @input="onInput"
            />
        </div>
    `,methods:{onInput(r){console.log(`onInput: ${r}`)}}}),i=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:"+58 0412-1234567"}},template:`
        <div>
            <label for="int_number">Enter your phone number</label>
            <kv-phone-input
                id="int_number"
                v-model="myCoolPhoneNumber"
            />
        </div>
    `}),l=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:"+58 123"}},template:`
        <div>
            <label for="invalid_number">Enter your phone number</label>
            <kv-phone-input
                id="invalid_number"
                v-model="myCoolPhoneNumber"
            />
        </div>
    `}),m=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:""}},template:`
        <div>
            <label for="empty">Enter your phone number</label>
            <kv-phone-input
                id="empty"
                v-model="myCoolPhoneNumber"
            />
        </div>
    `}),p=(o,{argTypes:n})=>({props:Object.keys(n),components:{KvPhoneInput:e},data(){return{myCoolPhoneNumber:"(503) 555-55",isValid:!1}},template:`
        <div>
            <component is="style">
                .valid::after {
                    content: 'valid';
                    color: green;
                }

                .invalid::after {
                    content: 'invalid';
                    color: red;
                }
            </component>

            <label for="invalid_number">Enter your phone number</label>
            <div :class="{ valid: isValid, invalid: !isValid }">
                <kv-phone-input
                    id="invalid_number"
                    v-model="myCoolPhoneNumber"
                    @validity-changed="onValidityChanged"
                />
            </div>
        </div>
    `,methods:{onValidityChanged(r){console.log(`onValidityChanged: ${r}`),this.isValid=r}}});var s,d,u;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: '828-479-5482' // kiva voicemail
    };
  },
  template: \`
        <div>
            <label for="my_default_input">Enter your phone number</label>
            <kv-phone-input
                id="my_default_input"
                v-model="myCoolPhoneNumber"
            />
        </div>
    \`
})`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var v,c,b;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: '828-479-5482'
    };
  },
  template: \`
        <div>
            <label for="events_input">Enter your phone number</label>
            <kv-phone-input
                id="events_input"
                v-model="myCoolPhoneNumber"
                @input="onInput"
            />
        </div>
    \`,
  methods: {
    onInput(val) {
      console.log(\`onInput: \${val}\`);
    }
  }
})`,...(b=(c=a.parameters)==null?void 0:c.docs)==null?void 0:b.source}}};var h,y,g;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: '+58 0412-1234567' // Venezuela sample number
    };
  },
  template: \`
        <div>
            <label for="int_number">Enter your phone number</label>
            <kv-phone-input
                id="int_number"
                v-model="myCoolPhoneNumber"
            />
        </div>
    \`
})`,...(g=(y=i.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var P,C,N;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: '+58 123'
    };
  },
  template: \`
        <div>
            <label for="invalid_number">Enter your phone number</label>
            <kv-phone-input
                id="invalid_number"
                v-model="myCoolPhoneNumber"
            />
        </div>
    \`
})`,...(N=(C=l.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};var k,_,f;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: ''
    };
  },
  template: \`
        <div>
            <label for="empty">Enter your phone number</label>
            <kv-phone-input
                id="empty"
                v-model="myCoolPhoneNumber"
            />
        </div>
    \`
})`,...(f=(_=m.parameters)==null?void 0:_.docs)==null?void 0:f.source}}};var I,V,E;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvPhoneInput
  },
  data() {
    return {
      myCoolPhoneNumber: '(503) 555-55',
      isValid: false
    };
  },
  template: \`
        <div>
            <component is="style">
                .valid::after {
                    content: 'valid';
                    color: green;
                }

                .invalid::after {
                    content: 'invalid';
                    color: red;
                }
            </component>

            <label for="invalid_number">Enter your phone number</label>
            <div :class="{ valid: isValid, invalid: !isValid }">
                <kv-phone-input
                    id="invalid_number"
                    v-model="myCoolPhoneNumber"
                    @validity-changed="onValidityChanged"
                />
            </div>
        </div>
    \`,
  methods: {
    onValidityChanged(isValid) {
      console.log(\`onValidityChanged: \${isValid}\`);
      this.isValid = isValid;
    }
  }
})`,...(E=(V=p.parameters)==null?void 0:V.docs)==null?void 0:E.source}}};const A=["Default","UsingEvents","InitializeWithNonUSNumber","InitializeWithInvalidNumber","InitializeWithNothing","CheckingValidity"];export{p as CheckingValidity,t as Default,l as InitializeWithInvalidNumber,i as InitializeWithNonUSNumber,m as InitializeWithNothing,a as UsingEvents,A as __namedExportsOrder,w as default};
