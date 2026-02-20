import{c as I,K as t}from"./entry-cause-selector-data-mock-slQtQjm9dC.js";import"./entry-index-Dew-HucFLB.js";import"./entry-KvIcon-BUhAos7YaB.js";import"./iframe-Cc_r_Bkf.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-importHelpers-zIMYNa8D_v.js";const $={title:"Kv/KvCauseSelector",component:t,args:{cause:"COVID-19",asRadio:!1,asIcon:!1,disabled:!1,checked:!1},argTypes:{cause:{control:{type:"select"},options:I}}},e=(l,{argTypes:c})=>({props:Object.keys(c),components:{KvCauseSelector:t},methods:{onChange(r){console.log(`Changed to ${r}`)}},setup(){return l},template:`
        <div>
            <kv-cause-selector
                :cause="cause"
                :checked="checked"
                :disabled="disabled"
                :as-radio="asRadio"
                :as-icon="asIcon"
                @change="onChange"
              />
        </div>
    `}),s=e.bind({});s.args={disabled:!0};const n=(l,{argTypes:c})=>({components:{KvCauseSelector:t},props:Object.keys(c),data(){return{causeList:I}},methods:{onChange(r){console.log(`Changed to ${r}`)}},template:`
    <div>
        <ul class="ul">
            <li
                class="li"
                v-for="cause in causeList"
                :key="cause"
            >
                <kv-cause-selector
                    :cause="cause"
                    :as-radio="asRadio"
                    :as-icon="asIcon"
                    :disabled="disabled"
                    @change="onChange"
                />
            </li>
        </ul>
        <component is="style">
            .ul {
                list-style: none;
                display: flex;
            }

            .li {
                margin: 0;
                padding: 0;
                margin-right: 2.75rem;
            }
        </component>
    </div>
    `});n.argTypes={checked:{control:{disable:!0}},cause:{control:{disable:!0}}};const a=n.bind({});a.args={asRadio:!0};const o=n.bind({});o.args={asIcon:!0};var i,d,u;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvCauseSelector
  },
  methods: {
    onChange(val) {
      console.log(\`Changed to \${val}\`);
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-cause-selector
                :cause="cause"
                :checked="checked"
                :disabled="disabled"
                :as-radio="asRadio"
                :as-icon="asIcon"
                @change="onChange"
              />
        </div>
    \`
})`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var p,g,m;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvCauseSelector
  },
  methods: {
    onChange(val) {
      console.log(\`Changed to \${val}\`);
    }
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <kv-cause-selector
                :cause="cause"
                :checked="checked"
                :disabled="disabled"
                :as-radio="asRadio"
                :as-icon="asIcon"
                @change="onChange"
              />
        </div>
    \`
})`,...(m=(g=s.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};var h,v,y;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvCauseSelector
  },
  props: Object.keys(argTypes),
  data() {
    return {
      causeList
    };
  },
  methods: {
    onChange(val) {
      console.log(\`Changed to \${val}\`);
    }
  },
  template: \`
    <div>
        <ul class="ul">
            <li
                class="li"
                v-for="cause in causeList"
                :key="cause"
            >
                <kv-cause-selector
                    :cause="cause"
                    :as-radio="asRadio"
                    :as-icon="asIcon"
                    :disabled="disabled"
                    @change="onChange"
                />
            </li>
        </ul>
        <component is="style">
            .ul {
                list-style: none;
                display: flex;
            }

            .li {
                margin: 0;
                padding: 0;
                margin-right: 2.75rem;
            }
        </component>
    </div>
    \`
})`,...(y=(v=n.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var b,C,k;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvCauseSelector
  },
  props: Object.keys(argTypes),
  data() {
    return {
      causeList
    };
  },
  methods: {
    onChange(val) {
      console.log(\`Changed to \${val}\`);
    }
  },
  template: \`
    <div>
        <ul class="ul">
            <li
                class="li"
                v-for="cause in causeList"
                :key="cause"
            >
                <kv-cause-selector
                    :cause="cause"
                    :as-radio="asRadio"
                    :as-icon="asIcon"
                    :disabled="disabled"
                    @change="onChange"
                />
            </li>
        </ul>
        <component is="style">
            .ul {
                list-style: none;
                display: flex;
            }

            .li {
                margin: 0;
                padding: 0;
                margin-right: 2.75rem;
            }
        </component>
    </div>
    \`
})`,...(k=(C=a.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var f,S,A;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    KvCauseSelector
  },
  props: Object.keys(argTypes),
  data() {
    return {
      causeList
    };
  },
  methods: {
    onChange(val) {
      console.log(\`Changed to \${val}\`);
    }
  },
  template: \`
    <div>
        <ul class="ul">
            <li
                class="li"
                v-for="cause in causeList"
                :key="cause"
            >
                <kv-cause-selector
                    :cause="cause"
                    :as-radio="asRadio"
                    :as-icon="asIcon"
                    :disabled="disabled"
                    @change="onChange"
                />
            </li>
        </ul>
        <component is="style">
            .ul {
                list-style: none;
                display: flex;
            }

            .li {
                margin: 0;
                padding: 0;
                margin-right: 2.75rem;
            }
        </component>
    </div>
    \`
})`,...(A=(S=o.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};const D=["Default","Disabled","AllAsCheckbox","AllAsRadio","AllAsIcon"];export{n as AllAsCheckbox,o as AllAsIcon,a as AllAsRadio,e as Default,s as Disabled,D as __namedExportsOrder,$ as default};
