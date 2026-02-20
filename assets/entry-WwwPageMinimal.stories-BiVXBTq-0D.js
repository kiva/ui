import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-mCpo5aGk5H.js";import{b as M,f as x,w as b,i as S,l as c,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as $}from"./entry-TheBasketBar-Cgdj9ciXsz.js";import{T as N}from"./entry-syncDate-B5_baTpRcj.js";import{T as O}from"./entry-TheFooter-95dkQre_cW.js";import{c as Y,a as r,q as j,v as A,r as t,o as C}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as L}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-C9WvITgRyG.js";import"./entry-getCacheKey-CFbvtT9xx4.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-BA7nBLyz1b.js";import"./entry-KvLoadingSpinner-CpYE5b1xV2.js";import"./iframe-Cc_r_Bkf.js";import"./entry-kiva-logo-CXWq-YcmJ4.js";import"./entry-CampaignLogoGroup-R50IhBJ4kn.js";import"./entry-KvContentfulImg-B0t9ZCrx8O.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-KvLoadingPlaceholder-B_9_tltQhY.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-DUwPoPrS-N.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvPageContainer-Dh8GJwjiow.js";import"./entry-KvUserAvatar-DmX-R6-wYd.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvThemeProvider-BF4_ArwXOx.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-PromoCreditBanner-CN7uFBF8a4.js";import"./entry-promoCredit-w2GeqDaA1T.js";import"./entry-confetti.module-BCnSlh9tqh.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-KvTextInput-CnVgGp-sYq.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvAccordionItem-C1aTJ3Gq8C.js";import"./entry-KvExpandable-Bd-oWmSPhz.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-Cgm16aFdnL.js";const w={name:"WwwPageMinimal",components:{CookieBanner:$,TheBasketBar:B,TheFooter:O,TheHeader:N}},D={class:"www-page"};function E(m,i,V,q,I,z){const f=t("the-header"),g=t("the-footer"),T=t("the-basket-bar"),_=t("cookie-banner");return C(),Y("div",D,[r(f,{minimal:!0}),j("main",null,[A(m.$slots,"default")]),r(g),r(T),r(_)])}const u=L(w,[["render",E]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Je={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:c,iwdFooterTheme:S,wrdFooterTheme:b,fifteenYearFooterTheme:x,blueFooter:M}}}}},e=(m,{argTypes:i})=>({props:Object.keys(i),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return m},template:`
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
