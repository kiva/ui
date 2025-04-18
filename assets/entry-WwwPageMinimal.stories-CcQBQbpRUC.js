import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-B9eZY3UCMa.js";import{a as d,c as x,d as M,e as S,g as b,l as h,i as F,w as H,f as W,b as P}from"./entry-siteThemes-B07ujV8qmR.js";import{C as B,T as A,d as $}from"./entry-TheBasketBar-eALDHTQvTV.js";import{a as j}from"./entry-app-install-mixin-CAF0UfpdGy.js";import{a as N}from"./entry-myKivaUtils-DZaR60Pkd9.js";import{T as O}from"./entry-syncDate-CmZH1PN8iO.js";import{T as Y}from"./entry-TheFooter-D-62uvoOUG.js";import{c as C,a as i,e as E,g as L,r as m,o as q}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-B_o7EklNFh.js";import"./entry-getCacheKey-CsL5DFtbio.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-KvMaterialIcon-Do7tkng7tH.js";import"./entry-KvWideLoanCard-UZGuFHBpxm.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvButton-CDAm7sgGzJ.js";import"./entry-KvLoadingSpinner-D8lUagFo7U.js";import"./entry-numeral-CmvrP3KSIW.js";import"./entry-get-CNsXUaDw28.js";import"./entry-isSymbol-CW-Mfw5CbL.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-experimentVersion-DPC15KwAMV.js";import"./entry-settingsUtils-CFNuLM2VJH.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-DGXt1zOePE.js";import"./iframe-C0KmlhQA.js";import"../sb-preview/runtime.js";import"./entry-_baseIteratee-C8yU5wbHrO.js";import"./entry-keys-CuD-aaEZFB.js";import"./entry-orderBy-BHxczOJVTo.js";import"./entry-_baseAssignValue-CDWe7vwZFk.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-kiva-logo-DTbI8_bt93.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-CampaignLogoGroup-D7eoo7E_IW.js";import"./entry-KvContentfulImg-wuAA_lEdpv.js";import"./entry-throttle-8Iekv00Rf1.js";import"./entry-toNumber-DdX6xnS_xy.js";import"./entry-myKivaForAllUsers-BLxm_xVwJ9.js";import"./entry-KvPageContainer-i_M91NdDU9.js";import"./entry-toInteger-qbckGqxOeY.js";import"./entry-fuse.common-BVsdn89gWS.js";import"./entry-comparators-Dl7wUbGSK1.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-filterConfig-DkSV7VUB50.js";import"./entry-numberUtils-CJK53TfNzV.js";import"./entry-filterUtils-D9QOWiMhS9.js";import"./entry-sortOptions-CO3grbx51X.js";import"./entry-regions-SUKu4I9Dy2.js";import"./entry-KvTextInput-CJrbQ5q124.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-gRsgxFhLT3.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-KvAccordionItem-MoWWJdmH4F.js";import"./entry-KvExpandable-bUiE41ePcz.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-rich-text-html-renderer.es5-CxPUgYwkiS.js";import"./entry-KvGrid-CK6VETMDN1.js";const w={name:"WwwPageMinimal",inject:["apollo","cookieStore"],components:{CookieBanner:B,TheBasketBar:A,TheFooter:Y,TheHeader:O},mixins:[j],apollo:{preFetch(t,e){return Promise.all([e.query({query:$}),N(e)])}}},I={class:"www-page"};function V(t,e,z,G,J,K){const f=m("the-header"),g=m("the-footer"),T=m("the-basket-bar"),_=m("cookie-banner");return q(),C("div",I,[i(f,{minimal:!0}),E("main",null,[L(t.$slots,"default")]),i(g),i(T),i(_)])}const u=D(w,[["render",V]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const to={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:d,iwdHeaderTheme:x,wrdHeaderTheme:M,fifteenYearHeaderTheme:S,blueHeader:b}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:h,iwdFooterTheme:F,wrdFooterTheme:H,fifteenYearFooterTheme:W,blueFooter:P}}}}},o=(t,{argTypes:e})=>({props:Object.keys(e),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return t},template:`
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
})`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const io=["Default","Themed"];export{o as Default,r as Themed,io as __namedExportsOrder,to as default};
