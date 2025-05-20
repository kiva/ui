import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-DnSq9xEYx4.js";import{b as x,f as M,w as S,i as b,l as c,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as A,d as $}from"./entry-TheBasketBar-D9Ti2QlF3b.js";import{a as j}from"./entry-app-install-mixin-9iYWHPCyAT.js";import{a as N}from"./entry-myKivaUtils-BBm1SjYc3C.js";import{T as O}from"./entry-syncDate-CFJ1bOdl3I.js";import{T as Y}from"./entry-TheFooter-BmOfQHuXtl.js";import{c as C,a as i,d as E,f as L,r as a,o as q}from"./entry-vue.esm-bundler-Q9GDM36OM6.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-05VL584Z9z.js";import"./entry-getCacheKey-ClIkr99w2Z.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-KvMaterialIcon-zoO3pT-PAH.js";import"./entry-KvWideLoanCard-BcPVF-r37T.js";import"./entry-numeral-CMfb424cHV.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvButton-UOIg3lzKaw.js";import"./entry-KvLoadingSpinner-C-UVvwKT3n.js";import"./entry-get-Bzt--l23_4.js";import"./entry-isSymbol-CbR_gDhvXj.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-experimentVersion-DPC15KwAMV.js";import"./entry-settingsUtils-B6HCH--cCk.js";import"./entry-index-COmIkRYU2t.js";import"./iframe-Dz_ZBMs0.js";import"../sb-preview/runtime.js";import"./entry-_baseIteratee-DqHyoBxxWE.js";import"./entry-keys-6kO3nYrkWo.js";import"./entry-_baseMap-hxLSR6vmhu.js";import"./entry-_baseAssignValue-BGrwCp9DJV.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-kiva-logo-BgvpGHUz3S.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-CampaignLogoGroup-BW6zpwgO1f.js";import"./entry-KvContentfulImg-BhLIWDoNt9.js";import"./entry-throttle-DDxHhs6iXw.js";import"./entry-toNumber-BqtdDPOj-V.js";import"./entry-myKivaForAllUsers-BLxm_xVwJ9.js";import"./entry-KvPageContainer-BJXjniWcQq.js";import"./entry-toInteger-DwZt6yOPCy.js";import"./entry-fuse.common-BV4UzntpY3.js";import"./entry-comparators-BRogqMVmB_.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-loanSearchState-CuIdompw93.js";import"./entry-KvTextInput-a4FppCX_5a.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-C_VsByM8Lw.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-KvAccordionItem-KfpzoMXYOx.js";import"./entry-KvExpandable-DsJhrbihOF.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-rich-text-html-renderer.es5-CxPUgYwkiS.js";import"./entry-KvGrid-DjNxFqXtSM.js";const w={name:"WwwPageMinimal",inject:["apollo","cookieStore"],components:{CookieBanner:A,TheBasketBar:B,TheFooter:Y,TheHeader:O},mixins:[j],apollo:{preFetch(t,e){return Promise.all([e.query({query:$}),N(e)])}}},I={class:"www-page"};function V(t,e,z,G,J,K){const f=a("the-header"),g=a("the-footer"),T=a("the-basket-bar"),_=a("cookie-banner");return q(),C("div",I,[i(f,{minimal:!0}),E("main",null,[L(t.$slots,"default")]),i(g),i(T),i(_)])}const u=D(w,[["render",V]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Xe={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:c,iwdFooterTheme:b,wrdFooterTheme:S,fifteenYearFooterTheme:M,blueFooter:x}}}}},o=(t,{argTypes:e})=>({props:Object.keys(e),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return t},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),r=o.bind({});r.args={headerTheme:h,footerTheme:c};var m,n,s;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`(args, {
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
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,d;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
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
})`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const Ze=["Default","Themed"];export{o as Default,r as Themed,Ze as __namedExportsOrder,Xe as default};
