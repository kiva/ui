import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-BVQKmGXSxy.js";import{b as M,f as x,w as b,i as S,l as c,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as $}from"./entry-TheBasketBar-17hqXkBLPQ.js";import{T as N}from"./entry-syncDate-Wk-dvH85W5.js";import{T as O}from"./entry-TheFooter-D9F70IXiSu.js";import{c as Y,a as r,e as j,g as A,r as t,o as C}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{_ as L}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-CBBItbLSAS.js";import"./entry-getCacheKey-Bz8TQWg-wU.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-mdi-CxS5kPhO5v.js";import"./entry-KvMaterialIcon-xI3aqUMDCm.js";import"./entry-KvWwwHeader-CoZoGmfOYd.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-CYQmlfiI14.js";import"./entry-KvLoadingSpinner-DdrXvKPVNY.js";import"./iframe-bZMg_mab.js";import"./entry-kiva-logo-C3UoheITu5.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-CampaignLogoGroup-C5Xmr5NXQa.js";import"./entry-KvContentfulImg-BMblaEKGwF.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-imageUtils-_95xo2d0ng.js";import"./entry-KvLoadingPlaceholder-BfNe1stGvO.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-USlSQzpKdw.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvPageContainer-C7hF2rQtbp.js";import"./entry-KvUserAvatar-D6X0x0f2qV.js";import"./entry-throttle-DR-Bh3IiJx.js";import"./entry-KvThemeProvider-iiXZi-jI6j.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-PromoCreditBanner-CYJEiNfqeM.js";import"./entry-promoCredit-Ccn1XEEJ6c.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-KvTextInput-C9HPmYZi94.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvAccordionItem-CBSwxvIxhZ.js";import"./entry-KvExpandable-CopxdvYypk.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-Dz6TYt_lr0.js";const w={name:"WwwPageMinimal",components:{CookieBanner:$,TheBasketBar:B,TheFooter:O,TheHeader:N}},D={class:"www-page"};function E(m,i,V,I,q,z){const f=t("the-header"),g=t("the-footer"),T=t("the-basket-bar"),_=t("cookie-banner");return C(),Y("div",D,[r(f,{minimal:!0}),j("main",null,[A(m.$slots,"default")]),r(g),r(T),r(_)])}const u=L(w,[["render",E]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Je={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:c,iwdFooterTheme:S,wrdFooterTheme:b,fifteenYearFooterTheme:x,blueFooter:M}}}}},e=(m,{argTypes:i})=>({props:Object.keys(i),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return m},template:`
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
})`,...(d=(l=o.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const Ke=["Default","Themed"];export{e as Default,o as Themed,Ke as __namedExportsOrder,Je as default};
