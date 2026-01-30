import{K as e}from"./entry-KvPillToggle-DtBIomxstK.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const D={title:"Kv/Form Elements/KvPillToggle",component:e},t=()=>({components:{KvPillToggle:e},data(){return{options:[{title:"Option 1",key:"o1"},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],selected:"o2"}},template:`
        <div>
            <kv-pill-toggle
                id="pill"
                :options="options"
                :selected="selected"
            />
        </div>
    `}),n=()=>({components:{KvPillToggle:e},data(){return{options:[{title:"Option 1",key:"o1",disabled:!0},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],selected:"o2"}},template:`
        <kv-pill-toggle
            id="pill"
            :options="options"
            :selected="selected"
        />
    `}),o=()=>({components:{KvPillToggle:e},data(){return{options:[{title:"Option 1",key:"o1"},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}]}},template:`
        <kv-pill-toggle
            id="pill"
            :options="options"
        />
    `}),i=()=>({components:{KvPillToggle:e},data(){return{options1:[{title:"Option 1",key:"o1"},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],selected1:"o1",options2:[{title:"Option 1",key:"o1"},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],selected2:"o2",options3:[{title:"Option 1",key:"o1"},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],selected3:"o3"}},template:`
        <div>
            <kv-pill-toggle
                id="pill1"
                :options="options1"
                :selected="selected1"
            />
            <kv-pill-toggle
                id="pill2"
                :options="options2"
                :selected="selected2"
            />
            <kv-pill-toggle
                id="pill3"
                :options="options3"
                :selected="selected3"
            />
        </div>
    `}),l=()=>({components:{KvPillToggle:e},data(){return{options:[{title:"LoremEu do ad anim sit consectetur esse elit deserunt occaecat.",key:"o1"},{title:"Small",key:"o2"},{title:"LoremEu do ad anim sit consectetur esse elit deserunt occaecat.",key:"o3"},{title:"LoremEu do ad anim sit consectetur esse elit deserunt occaecat.",key:"o4"}]}},template:`
        <kv-pill-toggle
            id="pill"
            :options="options"
        />
    `}),s=()=>({components:{KvPillToggle:e},data(){return{options:[{title:"$10",key:"o1"},{title:"$25",key:"o2"},{title:"$50",key:"o3"},{title:"$100",key:"o4"},{title:"Other",key:"o5"}]}},template:`
        <kv-pill-toggle
            id="pill"
            :options="options"
            :split-pills="true"
            selected="o2"
        />
    `});var p,r,a;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options: [{
        title: 'Option 1',
        key: 'o1'
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      selected: 'o2'
    };
  },
  template: \`
        <div>
            <kv-pill-toggle
                id="pill"
                :options="options"
                :selected="selected"
            />
        </div>
    \`
})`,...(a=(r=t.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};var c,d,k;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options: [{
        title: 'Option 1',
        key: 'o1',
        disabled: true
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      selected: 'o2'
    };
  },
  template: \`
        <kv-pill-toggle
            id="pill"
            :options="options"
            :selected="selected"
        />
    \`
})`,...(k=(d=n.parameters)==null?void 0:d.docs)==null?void 0:k.source}}};var m,g,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options: [{
        title: 'Option 1',
        key: 'o1'
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }]
    };
  },
  template: \`
        <kv-pill-toggle
            id="pill"
            :options="options"
        />
    \`
})`,...(u=(g=o.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var y,O,v;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options1: [{
        title: 'Option 1',
        key: 'o1'
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      selected1: 'o1',
      options2: [{
        title: 'Option 1',
        key: 'o1'
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      selected2: 'o2',
      options3: [{
        title: 'Option 1',
        key: 'o1'
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      selected3: 'o3'
    };
  },
  template: \`
        <div>
            <kv-pill-toggle
                id="pill1"
                :options="options1"
                :selected="selected1"
            />
            <kv-pill-toggle
                id="pill2"
                :options="options2"
                :selected="selected2"
            />
            <kv-pill-toggle
                id="pill3"
                :options="options3"
                :selected="selected3"
            />
        </div>
    \`
})`,...(v=(O=i.parameters)==null?void 0:O.docs)==null?void 0:v.source}}};var P,S,K;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options: [{
        title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
        key: 'o1'
      }, {
        title: 'Small',
        key: 'o2'
      }, {
        title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
        key: 'o3'
      }, {
        title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
        key: 'o4'
      }]
    };
  },
  template: \`
        <kv-pill-toggle
            id="pill"
            :options="options"
        />
    \`
})`,...(K=(S=l.parameters)==null?void 0:S.docs)==null?void 0:K.source}}};var T,E,L;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
  components: {
    KvPillToggle
  },
  data() {
    return {
      options: [{
        title: '$10',
        key: 'o1'
      }, {
        title: '$25',
        key: 'o2'
      }, {
        title: '$50',
        key: 'o3'
      }, {
        title: '$100',
        key: 'o4'
      }, {
        title: 'Other',
        key: 'o5'
      }]
    };
  },
  template: \`
        <kv-pill-toggle
            id="pill"
            :options="options"
            :split-pills="true"
            selected="o2"
        />
    \`
})`,...(L=(E=s.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};const _=["Default","Disabled","NoneSelected","MultipleOnPage","LongTitles","SplitPills"];export{t as Default,n as Disabled,l as LongTitles,i as MultipleOnPage,o as NoneSelected,s as SplitPills,_ as __namedExportsOrder,D as default};
