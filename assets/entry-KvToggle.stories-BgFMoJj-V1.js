import{K as n}from"./entry-KvToggle-Cx1MAZLaID.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const O={title:"Kv/Form Elements/KvToggle",component:n},o=()=>({components:{KvToggle:n},data(){return{option1:!1,option2:!0,option3:!1}},template:`
        <fieldset>
            <legend>Using v-model</legend>
            <kv-toggle
                id="toggle-1"
                v-model="option1"
                @change="onChange"
                disabled
            >
                Option 1
            </kv-toggle>
            <kv-toggle
                id="toggle-2"
                v-model="option2"
                @change="onChange"
            >
                Option 2
            </kv-toggle>
            <kv-toggle
                id="toggle-3"
                v-model="option3"
                @change="onChange"
            >
                Option 3
            </kv-toggle>
        </fieldset>
    `,methods:{onChange(e){console.log(e)}}}),t=()=>({components:{KvToggle:n},template:`
        <fieldset>
            <legend>Using :checked</legend>
            <kv-toggle
                id="checked1"
                :checked="someMethod(true)"
                @change="onChange"
            >
                True by default
            </kv-toggle>
            <kv-toggle
                id="checked2"
                :checked="someMethod(false)"
                @change="onChange"
            >
                False by default
            </kv-toggle>
        </fieldset>
    `,methods:{onChange(e){console.log(e)},someMethod(e){return e}}}),g=()=>({components:{KvToggle:n},template:`
        <fieldset>
            <legend>Font Sized</legend>
            <kv-toggle
                id="big"
                :checked="true"
                style="font-size: 2rem;"
            >
                2rem
            </kv-toggle>
            <kv-toggle
                id="normal"
                :checked="true"
            >
            normal
            </kv-toggle>
            <kv-toggle
                id="small"
                :checked="true"
                style="font-size: .875rem;"
            >
                .875rem
            </kv-toggle>
            <kv-toggle
                id="smaller"
                :checked="true"
                style="font-size: .75rem;"
            >
                .75rem
            </kv-toggle>
        </fieldset>
    `}),l=()=>({components:{KvToggle:n},template:`
        <fieldset>
            <legend>With Contents</legend>
            <kv-toggle
                id="option-1"
                :checked="true"
            >
                <h2>Big Header</h2>
                <p>Some explanatory text</p>
            </kv-toggle>
            <kv-toggle
                id="option-2"
                :checked="false"
            >
                Option 2
            </kv-toggle>
            <kv-toggle
                id="option-3"
                :checked="false"
            >
                Option 3
            </kv-toggle>
        </fieldset>
    `});var d,s,a;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`() => ({
  components: {
    KvToggle
  },
  data() {
    return {
      option1: false,
      option2: true,
      option3: false
    };
  },
  template: \`
        <fieldset>
            <legend>Using v-model</legend>
            <kv-toggle
                id="toggle-1"
                v-model="option1"
                @change="onChange"
                disabled
            >
                Option 1
            </kv-toggle>
            <kv-toggle
                id="toggle-2"
                v-model="option2"
                @change="onChange"
            >
                Option 2
            </kv-toggle>
            <kv-toggle
                id="toggle-3"
                v-model="option3"
                @change="onChange"
            >
                Option 3
            </kv-toggle>
        </fieldset>
    \`,
  methods: {
    onChange(val) {
      console.log(val);
    }
  }
})`,...(a=(s=o.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var r,i,c;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
  components: {
    KvToggle
  },
  template: \`
        <fieldset>
            <legend>Using :checked</legend>
            <kv-toggle
                id="checked1"
                :checked="someMethod(true)"
                @change="onChange"
            >
                True by default
            </kv-toggle>
            <kv-toggle
                id="checked2"
                :checked="someMethod(false)"
                @change="onChange"
            >
                False by default
            </kv-toggle>
        </fieldset>
    \`,
  methods: {
    onChange(val) {
      console.log(val);
    },
    someMethod(param) {
      return param;
    }
  }
})`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var m,k,p;g.parameters={...g.parameters,docs:{...(m=g.parameters)==null?void 0:m.docs,source:{originalSource:`() => ({
  components: {
    KvToggle
  },
  template: \`
        <fieldset>
            <legend>Font Sized</legend>
            <kv-toggle
                id="big"
                :checked="true"
                style="font-size: 2rem;"
            >
                2rem
            </kv-toggle>
            <kv-toggle
                id="normal"
                :checked="true"
            >
            normal
            </kv-toggle>
            <kv-toggle
                id="small"
                :checked="true"
                style="font-size: .875rem;"
            >
                .875rem
            </kv-toggle>
            <kv-toggle
                id="smaller"
                :checked="true"
                style="font-size: .75rem;"
            >
                .75rem
            </kv-toggle>
        </fieldset>
    \`
})`,...(p=(k=g.parameters)==null?void 0:k.docs)==null?void 0:p.source}}};var h,v,f;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
  components: {
    KvToggle
  },
  template: \`
        <fieldset>
            <legend>With Contents</legend>
            <kv-toggle
                id="option-1"
                :checked="true"
            >
                <h2>Big Header</h2>
                <p>Some explanatory text</p>
            </kv-toggle>
            <kv-toggle
                id="option-2"
                :checked="false"
            >
                Option 2
            </kv-toggle>
            <kv-toggle
                id="option-3"
                :checked="false"
            >
                Option 3
            </kv-toggle>
        </fieldset>
    \`
})`,...(f=(v=l.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const z=["Default","Checked","FontSized","WithContents"];export{t as Checked,o as Default,g as FontSized,l as WithContents,z as __namedExportsOrder,O as default};
