import{H as r}from"./entry-HowKivaWorksLightbox-xnKfJMhIVD.js";import"./entry-KvLightbox-BrMDhnobRV.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-mdi-CvwCDwZH7q.js";import"./entry-printing-DMx4lS_4Te.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const u={title:"Components/BorrowerProfile/HowKivaWorksLightbox",component:r},o=()=>({components:{HowKivaWorksLightbox:r},data(){return{visible:!0}},template:`
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
