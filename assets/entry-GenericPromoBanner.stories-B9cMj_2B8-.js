import{G as t}from"./entry-GenericPromoBanner-D3GfThN272.js";import"./entry-KvIcon-BwUchOod1q.js";import"./iframe-Dx2jLTsk.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvProgressBar-DoEPy2EJkw.js";const u=function(e){var n=document.createElement("textarea");return n.innerHTML=e,n.value},d={iconKey:"present",promoBannerContent:{kvTrackEvent:[],link:"http://kiva.org",richText:u("Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.")}},f={title:"WwwFrame/Banners/GenericPromoBanner",component:t,args:d},r=(e,{argTypes:n})=>({props:Object.keys(n),components:{GenericPromoBanner:t},setup(){return e},template:`
        <div>
            <generic-promo-banner
                :icon-key="iconKey"
                :promo-banner-content="promoBannerContent"
            />
            <br/>
            <p class="subheader">Banner text supports basic html tags</p>
        </div>
    `}),o=(e,{argTypes:n})=>({props:Object.keys(n),components:{GenericPromoBanner:t},data(){return{icons:["present","kiva-card","monthly-good","iwd-flower","confirmation","info","question"]}},setup(){return d},template:`
        <div>
            <generic-promo-banner
                v-for="(icon, index) in icons"
                :icon-key="icon"
                :promo-banner-content="promoBannerContent"
                :key="index"
            />
            <br/>
            <p class="subheader">Banner text supports basic html tags</p>
        </div>
    `});var a,s,p;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    GenericPromoBanner
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <generic-promo-banner
                :icon-key="iconKey"
                :promo-banner-content="promoBannerContent"
            />
            <br/>
            <p class="subheader">Banner text supports basic html tags</p>
        </div>
    \`
})`,...(p=(s=r.parameters)==null?void 0:s.docs)==null?void 0:p.source}}};var c,i,m;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    GenericPromoBanner
  },
  data() {
    return {
      icons: ["present", "kiva-card", "monthly-good", "iwd-flower", "confirmation", "info", "question"]
    };
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <generic-promo-banner
                v-for="(icon, index) in icons"
                :icon-key="icon"
                :promo-banner-content="promoBannerContent"
                :key="index"
            />
            <br/>
            <p class="subheader">Banner text supports basic html tags</p>
        </div>
    \`
})`,...(m=(i=o.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const x=["Default","AllIcons"];export{o as AllIcons,r as Default,x as __namedExportsOrder,f as default};
