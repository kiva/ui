import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-GYlTECo5x7.js";import{a as d,c as x,d as M,e as S,g as b,l as h,i as F,w as H,f as W,b as P}from"./entry-siteThemes-B07ujV8qmR.js";import{C as B,T as A,d as $,a as j}from"./entry-TheBasketBar-CdExfS4BFU.js";import{a as N}from"./entry-app-install-mixin-CvdZ_id2IW.js";import{T as O}from"./entry-syncDate-DWjgit-2B1.js";import{T as Y}from"./entry-TheFooter-CDFQDKsXVx.js";import{c as C,a as i,e as E,g as L,r as m,o as q}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-B_o7EklNFh.js";import"./entry-getCacheKey-BHjq72jFSJ.js";import"./entry-experimentAssignment-DZFmVht9_e.js";import"./entry-experimentVersion-DPC15KwAMV.js";import"./entry-settingsUtils-DF1iFx7sT-.js";import"./entry-get-iRc4pJ7r6H.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-_baseToString-C08wEDsWoH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-index-COmIkRYU2t.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-KvMaterialIcon-DbyMVkeaMq.js";import"./entry-KvWideLoanCard-CbH2sjp8GX.js";import"./entry-KvButton-BVwNcQukwO.js";import"./entry-KvLoadingSpinner-CKG9dUfOiG.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./iframe-D829FNMK.js";import"../sb-preview/runtime.js";import"./entry-_baseIsEqual-IhsH9XTvIm.js";import"./entry-keys-CWqrnc1fyR.js";import"./entry-orderBy-CUolv3c6xC.js";import"./entry-_baseIteratee-g1uSU7iPXJ.js";import"./entry-_baseAssignValue-0CH7BhwL9t.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-kiva-logo-DTbI8_bt93.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-CampaignLogoGroup-CdcIxQyiye.js";import"./entry-KvContentfulImg-0AxA9fd-uA.js";import"./entry-throttle-C_gUPZjI8B.js";import"./entry-toNumber-BfkLXMgxIK.js";import"./entry-KvPageContainer-BmR0CCWjKe.js";import"./entry-toInteger-ByE7uYhomK.js";import"./entry-fuse.common-CY1jHVywCQ.js";import"./entry-comparators-Dl7wUbGSK1.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-filterConfig-C0iiubdtCN.js";import"./entry-numberUtils-CJK53TfNzV.js";import"./entry-filterUtils-gRHxKhMZca.js";import"./entry-sortOptions-DENdA1Pv2y.js";import"./entry-regions-BwbWqcR84n.js";import"./entry-KvTextInput-CE4ojnvt2x.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-Bmjmzf0oiN.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-KvAccordionItem-DzyduTttb-.js";import"./entry-KvExpandable-bUiE41ePcz.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-rich-text-html-renderer.es5-DcJ4MOIYHw.js";import"./entry-KvGrid-CDOs_dXLCg.js";const w={name:"WwwPageMinimal",inject:["apollo","cookieStore"],components:{CookieBanner:B,TheBasketBar:A,TheFooter:Y,TheHeader:O},mixins:[N],apollo:{preFetch(t,e){return Promise.all([e.query({query:$}),j(e)])}}},I={class:"www-page"};function V(t,e,z,G,J,K){const f=m("the-header"),g=m("the-footer"),T=m("the-basket-bar"),_=m("cookie-banner");return q(),C("div",I,[i(f,{minimal:!0}),E("main",null,[L(t.$slots,"default")]),i(g),i(T),i(_)])}const u=D(w,[["render",V]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const mo={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:d,iwdHeaderTheme:x,wrdHeaderTheme:M,fifteenYearHeaderTheme:S,blueHeader:b}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:h,iwdFooterTheme:F,wrdFooterTheme:H,fifteenYearFooterTheme:W,blueFooter:P}}}}},o=(t,{argTypes:e})=>({props:Object.keys(e),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return t},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),r=o.bind({});r.args={headerTheme:d,footerTheme:h};var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
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
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
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
})`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const ao=["Default","Themed"];export{o as Default,r as Themed,ao as __namedExportsOrder,mo as default};
