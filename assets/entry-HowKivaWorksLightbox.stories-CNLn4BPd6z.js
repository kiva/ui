import{H as r}from"./entry-HowKivaWorksLightbox-Dj3MQZWlVi.js";import"./entry-KvLightbox-CTfqxGksPQ.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-mdi-DPwWwISsJs.js";import"./entry-printing-DwWJHhrrq-.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-tokens-Cdn1heMTVo.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const u={title:"Components/BorrowerProfile/HowKivaWorksLightbox",component:r},o=()=>({components:{HowKivaWorksLightbox:r},data(){return{visible:!0}},template:`
        <div>
            <button class="tw-text-link" @click="visible = true">How it works</button>
            <how-kiva-works-lightbox
                :visible="visible"
                @lightbox-closed="visible = false"
            />
        </div>
    `});var t,i,e;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    HowKivaWorksLightbox
  },
  data() {
    return {
      visible: true
    };
  },
  template: \`
        <div>
            <button class="tw-text-link" @click="visible = true">How it works</button>
            <how-kiva-works-lightbox
                :visible="visible"
                @lightbox-closed="visible = false"
            />
        </div>
    \`
})`,...(e=(i=o.parameters)==null?void 0:i.docs)==null?void 0:e.source}}};const w=["Default"];export{o as Default,w as __namedExportsOrder,u as default};
