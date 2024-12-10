import{K as o}from"./entry-KvFlag-CXkNpF1ZFF.js";import{f as g}from"./entry-index-tEl-b4pUVq.js";import"./entry-getCacheKey-7R5iITfzvv.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";const b={title:"Kv/KvFlag",component:o,args:{country:"us",inlineSvg:!1,aspectRatio:"4x3"},argTypes:{country:{control:{type:"select"},options:g.getCountryList().map(e=>e.code)},aspectRatio:{control:{type:"radio"},options:["4x3","1x1"]}}},n=(e,{argTypes:s})=>({props:Object.keys(s),components:{KvFlag:o},setup(){return e},template:`
        <div>
            <div style="width: 32px">
                <kv-flag
                    :country="country"
                    :is-square="isSquare"
                />
            </div>
            <br />
            <kv-flag
                :country="country"
                :is-square="isSquare"
                style="width: 20px;"
             />
        </div>
    `}),r=n.bind({});r.args={isSquare:!0};const t=(e,{argTypes:s})=>({props:Object.keys(s),components:{KvFlag:o},data(){return{countryList:g.getCountryList()}},template:`
        <div>
            <div
                v-for="country in countryList"
                :key="country.code"
            >
                <div>{{ country.code }} - {{ country.name }}</div>
                <kv-flag
                    :country="country.code"
                    style="width: 32px;"
                />
            </div>
        </div>
    `});t.argTypes={country:{control:{disable:!0}}};var a,c,i;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvFlag
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <div style="width: 32px">
                <kv-flag
                    :country="country"
                    :is-square="isSquare"
                />
            </div>
            <br />
            <kv-flag
                :country="country"
                :is-square="isSquare"
                style="width: 20px;"
             />
        </div>
    \`
})`,...(i=(c=n.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var u,p,y;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvFlag
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <div style="width: 32px">
                <kv-flag
                    :country="country"
                    :is-square="isSquare"
                />
            </div>
            <br />
            <kv-flag
                :country="country"
                :is-square="isSquare"
                style="width: 20px;"
             />
        </div>
    \`
})`,...(y=(p=r.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var d,l,v;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvFlag
  },
  data() {
    return {
      countryList: getCountryList()
    };
  },
  template: \`
        <div>
            <div
                v-for="country in countryList"
                :key="country.code"
            >
                <div>{{ country.code }} - {{ country.name }}</div>
                <kv-flag
                    :country="country.code"
                    style="width: 32px;"
                />
            </div>
        </div>
    \`
})`,...(v=(l=t.parameters)==null?void 0:l.docs)==null?void 0:v.source}}};const h=["Default","Square","AllCountries"];export{t as AllCountries,n as Default,r as Square,h as __namedExportsOrder,b as default};
