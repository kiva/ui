import{G as t}from"./entry-GenericPromoBanner-DNQ2TlSfq-.js";import"./entry-KvIcon-BrNY7gjzFb.js";import"./iframe-D9Lm9jvt.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvAtbModal-DBQkdQ0mEi.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvProgressBar-Die9SF9X5I.js";const u=function(e){var n=document.createElement("textarea");return n.innerHTML=e,n.value},d={iconKey:"present",promoBannerContent:{kvTrackEvent:[],link:"http://kiva.org",richText:u("Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.")}},T={title:"WwwFrame/Banners/GenericPromoBanner",component:t,args:d},r=(e,{argTypes:n})=>({props:Object.keys(n),components:{GenericPromoBanner:t},setup(){return e},template:`
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
})`,...(p=(s=r.parameters)==null?void 0:s.docs)==null?void 0:p.source}}};var i,c,m;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`(_, {
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
})`,...(m=(c=o.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const w=["Default","AllIcons"];export{o as AllIcons,r as Default,w as __namedExportsOrder,T as default};
