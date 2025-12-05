import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-C3izjvs8S5.js";import{b as M,f as x,w as b,i as S,l as c,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as $}from"./entry-TheBasketBar-C4czQ8PDkw.js";import{T as N}from"./entry-syncDate-TWxyJV3rnG.js";import{T as O}from"./entry-TheFooter-CNnl_rm_I2.js";import{c as Y,a as r,e as j,g as A,r as t,o as C}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{_ as L}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-CBBItbLSAS.js";import"./entry-getCacheKey-VxIHkSwpKB.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-mdi-CxS5kPhO5v.js";import"./entry-KvMaterialIcon-DjW6IUJXeQ.js";import"./entry-KvWwwHeader-COss86YtUr.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-KvButton-p9fkQMtQm5.js";import"./entry-KvLoadingSpinner-BCoIpoxPqz.js";import"./iframe-BWPu5KZb.js";import"./entry-kiva-logo-C3UoheITu5.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-CampaignLogoGroup-Bv0JZDTS6h.js";import"./entry-KvContentfulImg-Blmr714YA9.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-imageUtils-_95xo2d0ng.js";import"./entry-KvLoadingPlaceholder-aJYFcp9wXs.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-USlSQzpKdw.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvPageContainer-B5lTEiv1QV.js";import"./entry-KvUserAvatar-dwKx8fX_PP.js";import"./entry-throttle-DR-Bh3IiJx.js";import"./entry-KvThemeProvider-C7wfdZ0uRf.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-PromoCreditBanner-BZ1OrbLJL9.js";import"./entry-promoCredit-A8tDfJh8uJ.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-KvTextInput-DYDOCDO2B2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvAccordionItem-D0v9-vm1mt.js";import"./entry-KvExpandable-CopxdvYypk.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-Bl4bKDL3O5.js";const w={name:"WwwPageMinimal",components:{CookieBanner:$,TheBasketBar:B,TheFooter:O,TheHeader:N}},D={class:"www-page"};function E(m,i,V,I,q,z){const f=t("the-header"),g=t("the-footer"),T=t("the-basket-bar"),_=t("cookie-banner");return C(),Y("div",D,[r(f,{minimal:!0}),j("main",null,[A(m.$slots,"default")]),r(g),r(T),r(_)])}const u=L(w,[["render",E]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Ge={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:c,iwdFooterTheme:S,wrdFooterTheme:b,fifteenYearFooterTheme:x,blueFooter:M}}}}},e=(m,{argTypes:i})=>({props:Object.keys(i),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return m},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),o=e.bind({});o.args={headerTheme:h,footerTheme:c};var a,n,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPageMinimal
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    \`
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,d;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPageMinimal
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    \`
})`,...(d=(l=o.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const Je=["Default","Themed"];export{e as Default,o as Themed,Je as __namedExportsOrder,Ge as default};
