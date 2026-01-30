import{K as e}from"./entry-KvCheckbox-BpNgvnZBeo.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const O={title:"Kv/Form Elements/KvCheckbox",component:e},o=()=>({components:{KvCheckbox:e},data(){return{option1:!1,option2:!0,option3:!1}},template:`
        <fieldset>
            <legend>Using v-model</legend>
            <kv-checkbox
                id="checkbox-1"
                v-model="option1"
                @update="onChange"
                disabled
            >
                Option 1
            </kv-checkbox>
            <kv-checkbox
                id="checkbox-2"
                v-model="option2"
                @update="onChange"
            >
                Option 2
            </kv-checkbox>
            <kv-checkbox
                id="checkbox-3"
                v-model="option3"
                @update="onChange"
            >
                Option 3
            </kv-checkbox>
        </fieldset>
    `,methods:{onChange(n){console.log(n)}}}),c=()=>({components:{KvCheckbox:e},template:`
        <fieldset>
            <legend>Using :checked</legend>
            <kv-checkbox
                id="checked1"
                :checked="someMethod(true)"
                @update="onChange"
            >
                True by default
            </kv-checkbox>
            <kv-checkbox
                id="checked2"
                :checked="someMethod(false)"
                @update="onChange"
            >
                False by default
            </kv-checkbox>
        </fieldset>
    `,methods:{onChange(n){console.log(n)},someMethod(n){return n}}}),t=()=>({components:{KvCheckbox:e},template:`
        <kv-checkbox
            id="right"
            :checkbox-right="true"
            :checked="true"
        >
            checkboxRight
        </kv-checkbox>
    `}),i=()=>({components:{KvCheckbox:e},template:`
        <fieldset>
            <legend>Font Sized</legend>
            <kv-checkbox
                id="big"
                :checked="true"
                style="font-size: 2rem;"
            >
                2rem
            </kv-checkbox>
            <kv-checkbox
                id="normal"
                :checked="true"
            >
            normal
            </kv-checkbox>
            <kv-checkbox
                id="small"
                :checked="true"
                style="font-size: .875rem;"
            >
                .875rem
            </kv-checkbox>
            <kv-checkbox
                id="smaller"
                :checked="true"
                style="font-size: .75rem;"
            >
                .75rem
            </kv-checkbox>
        </fieldset>
    `}),d=()=>({components:{KvCheckbox:e},template:`
        <kv-checkbox
            id="multi-line"
            :checked="true"
        >
            Lorem ipsum proident occaecat elit voluptate labore eu eiusmod quis elit enim commodo. Officia mollit Lorem do culpa quis consectetur deserunt sunt. Deserunt commodo non labore Lorem reprehenderit incididunt. Qui nisi nisi officia incididunt irure nostrud. Nulla laborum labore adipisicing aute anim sint ullamco adipisicing fugiat adipisicing. Ipsum elit mollit cillum aliquip irure reprehenderit ea duis. Velit duis in laborum sunt tempor adipisicing voluptate eiusmod aute.
        </kv-checkbox>
    `});var r,a,s;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
  components: {
    KvCheckbox
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
            <kv-checkbox
                id="checkbox-1"
                v-model="option1"
                @update="onChange"
                disabled
            >
                Option 1
            </kv-checkbox>
            <kv-checkbox
                id="checkbox-2"
                v-model="option2"
                @update="onChange"
            >
                Option 2
            </kv-checkbox>
            <kv-checkbox
                id="checkbox-3"
                v-model="option3"
                @update="onChange"
            >
                Option 3
            </kv-checkbox>
        </fieldset>
    \`,
  methods: {
    onChange(val) {
      console.log(val);
    }
  }
})`,...(s=(a=o.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var l,k,m;c.parameters={...c.parameters,docs:{...(l=c.parameters)==null?void 0:l.docs,source:{originalSource:`() => ({
  components: {
    KvCheckbox
  },
  template: \`
        <fieldset>
            <legend>Using :checked</legend>
            <kv-checkbox
                id="checked1"
                :checked="someMethod(true)"
                @update="onChange"
            >
                True by default
            </kv-checkbox>
            <kv-checkbox
                id="checked2"
                :checked="someMethod(false)"
                @update="onChange"
            >
                False by default
            </kv-checkbox>
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
})`,...(m=(k=c.parameters)==null?void 0:k.docs)==null?void 0:m.source}}};var h,u,p;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
  components: {
    KvCheckbox
  },
  template: \`
        <kv-checkbox
            id="right"
            :checkbox-right="true"
            :checked="true"
        >
            checkboxRight
        </kv-checkbox>
    \`
})`,...(p=(u=t.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var b,v,x;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
  components: {
    KvCheckbox
  },
  template: \`
        <fieldset>
            <legend>Font Sized</legend>
            <kv-checkbox
                id="big"
                :checked="true"
                style="font-size: 2rem;"
            >
                2rem
            </kv-checkbox>
            <kv-checkbox
                id="normal"
                :checked="true"
            >
            normal
            </kv-checkbox>
            <kv-checkbox
                id="small"
                :checked="true"
                style="font-size: .875rem;"
            >
                .875rem
            </kv-checkbox>
            <kv-checkbox
                id="smaller"
                :checked="true"
                style="font-size: .75rem;"
            >
                .75rem
            </kv-checkbox>
        </fieldset>
    \`
})`,...(x=(v=i.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var g,f,C;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`() => ({
  components: {
    KvCheckbox
  },
  template: \`
        <kv-checkbox
            id="multi-line"
            :checked="true"
        >
            Lorem ipsum proident occaecat elit voluptate labore eu eiusmod quis elit enim commodo. Officia mollit Lorem do culpa quis consectetur deserunt sunt. Deserunt commodo non labore Lorem reprehenderit incididunt. Qui nisi nisi officia incididunt irure nostrud. Nulla laborum labore adipisicing aute anim sint ullamco adipisicing fugiat adipisicing. Ipsum elit mollit cillum aliquip irure reprehenderit ea duis. Velit duis in laborum sunt tempor adipisicing voluptate eiusmod aute.
        </kv-checkbox>
    \`
})`,...(C=(f=d.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};const S=["Default","Checked","CheckboxRight","FontSized","MultiLine"];export{t as CheckboxRight,c as Checked,o as Default,i as FontSized,d as MultiLine,S as __namedExportsOrder,O as default};
