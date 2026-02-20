import{K as i}from"./entry-KvContentfulImg-eZvzi1SzQc.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const m={contentfulSrc:"https://images.ctfassets.net/j0p9a6ql0rn7/2TWV32iioxapwjn26ZpigZ/84ac39a1396d6be9eea472cf8791faa7/Cynthia.png",fallbackFormat:"jpg",width:200,height:null,alt:null,loading:"lazy",crop:null,sourceSizes:null},f={title:"Kv/KvContentfulImg",component:i,args:m},t=(e,{argTypes:a})=>({props:Object.keys(a),components:{KvContentfulImg:i},setup(){return{...e,crop:"&fit=fill&f=face",sourceSizes:[{width:1920,height:650,media:"min-width: 1441px"},{width:1440,height:620,media:"min-width: 1025px"},{width:1024,height:441,media:"min-width: 1024px"},{width:680,height:372,media:"min-width: 734px"},{width:480,height:540,media:"min-width: 0px"}],contentfulSrc:"https://images.ctfassets.net/j0p9a6ql0rn7/7mY5ZujL9UfbluRkVkHgkX/5ec83a74e7c1dc387f3fa35af34f5243/mg-hppromo-1-wxga-retina.jpg"}},template:`
        <kv-contentful-img
            :contentful-src="contentfulSrc"
            :fallback-format="fallbackFormat"
            :width="width"
            :height="height"
            :alt="alt"
            :loading="loading"
            :source-sizes="sourceSizes"
            :crop="crop"
        />
    `}),n=(e,{argTypes:a})=>({props:Object.keys(a),components:{KvContentfulImg:i},setup(){return e},template:`
        <kv-contentful-img
            :contentful-src="contentfulSrc"
            :fallback-format="fallbackFormat"
            :width="width"
            :height="height"
            :alt="alt"
            :loading="loading"
        />
    `});var o,r,c;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvContentfulImg
  },
  setup() {
    return {
      ...args,
      crop: '&fit=fill&f=face',
      sourceSizes: [{
        width: 1920,
        height: 650,
        media: 'min-width: 1441px'
      }, {
        width: 1440,
        height: 620,
        media: 'min-width: 1025px'
      }, {
        width: 1024,
        height: 441,
        media: 'min-width: 1024px'
      }, {
        width: 680,
        height: 372,
        media: 'min-width: 734px'
      }, {
        width: 480,
        height: 540,
        media: 'min-width: 0px'
      }],
      contentfulSrc: 'https://images.ctfassets.net/j0p9a6ql0rn7/7mY5ZujL9UfbluRkVkHgkX/5ec83a74e7c1dc387f3fa35af34f5243/mg-hppromo-1-wxga-retina.jpg'
    };
  },
  template: \`
        <kv-contentful-img
            :contentful-src="contentfulSrc"
            :fallback-format="fallbackFormat"
            :width="width"
            :height="height"
            :alt="alt"
            :loading="loading"
            :source-sizes="sourceSizes"
            :crop="crop"
        />
    \`
})`,...(c=(r=t.parameters)==null?void 0:r.docs)==null?void 0:c.source}}};var s,l,h;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvContentfulImg
  },
  setup() {
    return args;
  },
  template: \`
        <kv-contentful-img
            :contentful-src="contentfulSrc"
            :fallback-format="fallbackFormat"
            :width="width"
            :height="height"
            :alt="alt"
            :loading="loading"
        />
    \`
})`,...(h=(l=n.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};const u=["ImageSet","Default"];export{n as Default,t as ImageSet,u as __namedExportsOrder,f as default};
